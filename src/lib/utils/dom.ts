/** DOM manipulation utilities for client-side code. */

type EventHandler<E extends Event = Event> = (this: EventTarget, event: E) => void;

interface Registration {
  selector?: string;
  handler: EventHandler;
}

interface SharedEntry {
  listener: EventListener;
  registrations: Registration[];
}

interface SharedSlot {
  entry: SharedEntry;
  byName: Map<string, SharedEntry>;
}

/**
 * Shared listeners per (target element, event name) so that repeated `on` registrations reuse a
 * single underlying DOM listener. Keyed by the element's current `addEventListener` function, which
 * doubles as a generation marker: if that function is replaced (e.g. by a test spy), the delegation
 * layer starts over instead of reusing stale registrations.
 */
const sharedListeners = new WeakMap<
  EventTarget["addEventListener"],
  WeakMap<object, Map<string, SharedEntry>>
>();

const getSharedSlot = (target: EventTarget, name: string): SharedSlot => {
  const add = target.addEventListener; // oxlint-disable-line typescript/unbound-method

  let byElement = sharedListeners.get(add);
  if (!byElement) {
    byElement = new WeakMap();
    sharedListeners.set(add, byElement);
  }

  let byName = byElement.get(target);
  if (!byName) {
    byName = new Map();
    byElement.set(target, byName);
  }

  let entry = byName.get(name);
  if (!entry) {
    entry = { listener: () => {}, registrations: [] };
    const self = entry;
    self.listener = (event: Event) => {
      for (const registration of self.registrations) {
        dispatch(registration, target, event);
      }
    };
    byName.set(name, self);
    target.addEventListener(name, self.listener);
  }
  return { entry, byName };
};

const dispatch = (registration: Registration, target: EventTarget, event: Event): void => {
  const { selector, handler } = registration;
  if (!selector) {
    handler.call(target, event);
    return;
  }

  const eventTarget = event.target;
  if (eventTarget instanceof Element) {
    const matched = eventTarget.closest(selector);
    if (matched) handler.call(matched, event);
    return;
  }

  handler.call(target, event);
};

/**
 * Attach an event listener with optional CSS selector delegation. When a selector is provided, the
 * handler fires only if the event target matches it. Accepts a single event name or an array of
 * event names (duplicates are ignored). Returns an unsubscribe function.
 */
export function on<K extends keyof HTMLElementEventMap>(
  element: Element | Document,
  eventName: K | K[],
  handler: EventHandler<HTMLElementEventMap[K]>,
  selector?: string,
): () => void {
  const names = (Array.isArray(eventName) ? eventName : [eventName]).filter(
    (name, index, all) => all.indexOf(name) === index,
  );

  const typedHandler = handler as EventHandler; // oxlint-disable-line typescript/no-unsafe-type-assertion

  const registration: Registration =
    selector === undefined ? { handler: typedHandler } : { selector, handler: typedHandler };

  const offs = names.map((name) => {
    const { entry, byName } = getSharedSlot(element, name);
    entry.registrations.push(registration);

    return () => {
      const index = entry.registrations.indexOf(registration);
      if (index !== -1) entry.registrations.splice(index, 1);

      if (entry.registrations.length === 0) {
        element.removeEventListener(name, entry.listener);
        if (byName.get(name) === entry) byName.delete(name);
      }
    };
  });

  return () => {
    for (const off of offs) off();
  };
}
