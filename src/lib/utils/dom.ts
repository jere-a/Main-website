type EventHandler<E extends Event = Event> = (this: EventTarget, event: E) => void;

interface Registration {
  selector?: string;
  handler: EventHandler;
}

interface Entry {
  listener: EventListener;
  registrations: Registration[];
}

const shared = new WeakMap<EventTarget["addEventListener"], WeakMap<object, Map<string, Entry>>>();

const slot = (target: EventTarget, name: string) => {
  const add = target.addEventListener; // oxlint-disable-line typescript/unbound-method
  let byTarget = shared.get(add);
  if (!byTarget) shared.set(add, (byTarget = new WeakMap()));

  let byName = byTarget.get(target);
  if (!byName) byTarget.set(target, (byName = new Map()));

  let entry = byName.get(name);
  if (!entry) {
    entry = {
      listener: (event) => {
        for (const registration of entry!.registrations) {
          const { selector, handler } = registration;
          const eventTarget = event.target;
          if (!selector) {
            handler.call(target, event);
          } else if (eventTarget instanceof Element) {
            const matched = eventTarget.closest(selector);
            if (
              matched &&
              (target === eventTarget.ownerDocument ||
                (target instanceof Element && target.contains(matched)))
            ) {
              handler.call(matched, event);
            }
          } else {
            handler.call(target, event);
          }
        }
      },
      registrations: [],
    };
    byName.set(name, entry);
    target.addEventListener(name, entry.listener);
  }
  return { entry, byName };
};

export function on<K extends keyof HTMLElementEventMap>(
  element: Element | Document,
  eventName: K | K[],
  handler: EventHandler<HTMLElementEventMap[K]>,
  selector?: string,
): () => void {
  const names = [...new Set(Array.isArray(eventName) ? eventName : [eventName])];
  const registration: Registration = {
    ...(selector === undefined ? {} : { selector }),
    handler: handler as EventHandler, // oxlint-disable-line typescript/no-unsafe-type-assertion
  };

  const offs = names.map((name) => {
    const { entry, byName } = slot(element, name);
    entry.registrations.push(registration);
    return () => {
      const index = entry.registrations.indexOf(registration);
      if (index !== -1) entry.registrations.splice(index, 1);
      if (!entry.registrations.length) {
        element.removeEventListener(name, entry.listener);
        if (byName.get(name) === entry) byName.delete(name);
      }
    };
  });

  return () => offs.forEach((off) => off());
}
