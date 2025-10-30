import * as z from "zod/mini";
import { queryAll } from "../global";
import type {
  ajax,
  ElementCollectionParam,
  ElementDocument,
  each,
  func,
} from "./types.d";
import {
  ajaxgetSchema,
  ajaxSchema,
  ElementDocumentInstanceof,
  ParamSchema,
} from "./types.d";

class ElementCollection extends Array<Element | Document> {
  constructor(param?: ElementCollectionParam) {
    super();

    const parsed = ParamSchema.safeParse(param);
    if (!parsed.success) return;
    const value = parsed.data;

    if (value instanceof Element || value instanceof Document) {
      this.push(value);
    } else if (typeof value === "string") {
      const elements = queryAll(value);
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (el instanceof Element) {
          this.push(el);
        }
      }
    }
  }

  ready(cb: (this: Document) => func) {
    const doc = (() => {
      for (const el of this) {
        if (el instanceof Document) return el;
      }
      return null;
    })();

    if (doc && doc.readyState != null && doc.readyState !== "loading") {
      cb.call(doc);
    } else {
      this.on("DOMContentLoaded", function (this: ElementDocument) {
        cb.call(this as Document);
      });
    }
    return this;
  }

  on(
    event: string,
    cbOrSelector: ((this: ElementDocument, e: Event) => func) | string,
    cbOrOptions?:
      | ((this: ElementDocument, e: Event) => func)
      | AddEventListenerOptions,
  ) {
    if (
      typeof cbOrSelector === "string" ||
      typeof cbOrSelector === "function"
    ) {
      this.each((el: ElementDocument) => {
        const main = (e: Event) => {
          if (
            typeof cbOrSelector === "function" &&
            e.currentTarget instanceof Element
          ) {
            cbOrSelector.call(e.currentTarget, e);
          } else if (
            typeof cbOrSelector === "string" &&
            typeof cbOrOptions === "function" &&
            cbOrOptions
          ) {
            const target = e.target as Element;
            if (target.matches(cbOrSelector)) {
              cbOrOptions.call(target, e);
            }
          }
        };

        if (typeof cbOrOptions === "object") {
          el.addEventListener(event, main, cbOrOptions);
        } else {
          el.addEventListener(event, main);
        }
      });
    }

    return this;
  }

  one(
    event: string,
    cbOrSelector: ((this: ElementDocument, e: Event) => func) | string,
  ) {
    const once = { once: true };
    if (typeof cbOrSelector === "function") {
      this.on(event, cbOrSelector, once);
    }
    return this;
  }

  off(event: string, cb: (e: Event) => func) {
    this.forEach((el: ElementDocument) => {
      el.removeEventListener(event, cb);
    });
    return this;
  }

  is(selector: Element | string) {
    if (typeof selector === "object") {
      this.each((elem) => {
        return elem === selector;
      });
    } else {
      this.each((elem) => {
        if (elem instanceof Element) return elem.matches(selector);
      });
    }
    return this;
  }

  remove() {
    this.each((e) => {
      if (e instanceof Element) {
        e.remove();
      }
    });
    return this;
  }

  unwrap() {
    this.each((e) => {
      if (e instanceof Element) {
        e.replaceWith(...e.childNodes);
      }
    });
  }

  each(cb: (el: ElementDocument) => each): this {
    for (let i = 0; i < this.length; i++) {
      const el = this[i];
      if (!ElementDocumentInstanceof.safeParse(el).success) continue;
      const result = (cb as (el: ElementDocument) => each)(el);
      if (result === false) break;
    }

    return this;
  }

  text(text?: string) {
    if (text) {
      this.each((e) => {
        if (e instanceof Element) e.textContent = text;
      });
    } else {
      return this[0].textContent;
    }
    return this;
  }

  attr(name: string): string;
  attr(name: string, value: string): this;
  attr(name: string, value?: string): string | this {
    if (typeof value === "undefined" || value == null) {
      this.each((el) => {
        if (el == null) return "";
        if (el instanceof Element) {
          return el.getAttribute(name);
        }
      });
    } else {
      this.each((el) => {
        if (el instanceof Element) {
          el.setAttribute(name, value);
        }
      });
    }
    return this;
  }

  private static dataStore = new WeakMap<Element, Record<string, any>>();

  data(): Record<string, any> | undefined;
  data(name: string): any;
  data(name: string, value: any): this;
  data(name?: string, value?: any): any {
    const el = this[0];
    if (!(el instanceof Element)) return undefined;

    // Getter: .data()
    if (name === undefined) {
      const dataset = el instanceof HTMLElement ? { ...el.dataset } : {};
      const stored = ElementCollection.dataStore.get(el) || {};
      return { ...dataset, ...stored };
    }

    // Getter: .data(name)
    if (value === undefined) {
      const stored = ElementCollection.dataStore.get(el)?.[name];
      if (stored !== undefined) return stored;

      if (el instanceof HTMLElement) {
        return el.dataset?.[name];
      }

      return undefined;
    }

    // Setter: .data(name, value)
    this.each((elem) => {
      if (!(elem instanceof Element)) return;

      let store = ElementCollection.dataStore.get(elem);
      if (!store) {
        store = {};
        ElementCollection.dataStore.set(elem, store);
      }

      store[name] = value;
    });

    return this;
  }

  async ajax(data: ajax) {
    const info = ajaxSchema.parse(data);
    await fetch(info.url, {
      method: info.type,
    });
    return this;
  }

  load() {}

  removeClass(className: string) {
    this.each((e) => {
      if (e instanceof Element) {
        e.classList.remove(className);
      }
    });
    return this;
  }

  addClass(className: string) {
    this.each((e) => {
      if (e instanceof Element) {
        e.classList.add(className);
      }
    });
    return this;
  }

  hasClass(className: string) {
    this.each((e) => {
      if (e instanceof Element) {
        e.classList.contains(className);
      }
    });
    return this;
  }
}

export const $ = (param?: ElementCollectionParam) => {
  const col = new ElementCollection(param);

  return new Proxy(col, {
    get(target, prop, receiver) {
      // 1) your own methods/properties
      if (prop in target) {
        return Reflect.get(target, prop, receiver);
      }
      // 2) otherwise, forward to the first element
      const first = target[0];
      if (!first) return undefined;
      const val = (first as any)[prop];
      return typeof val === "function" ? val.bind(first) : val;
    },

    set(target, prop, value, receiver) {
      // 1) own props
      if (prop in target) {
        return Reflect.set(target, prop, value, receiver);
      }
      // 2) else set on *all* elements via your each()
      target.each((el) => {
        if (prop in el) {
          (el as any)[prop] = value;
        }
      });
      return true;
    },
  });
};

const ajaxgetfunctionSchema = z.function({
  input: [ajaxgetSchema],
});

$.get = ajaxgetfunctionSchema.implement((i) => {
  const queryString = Object.entries(i.data)
    .map(([key, value]) => {
      return `${key}=${value}`;
    })
    .join("&");

  fetch(`${i.url}?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": i.dataType,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((_data) => {});
});
