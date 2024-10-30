import { queryAll } from "../global";

class ElementCollection extends Array {
	constructor(param?: any) {
		super();
		if (typeof param === 'string' || param instanceof HTMLElement) {
			this.push(param);
		} else if (typeof param === 'function' || param instanceof Document) {
			this.push(param)
		} else {
			let elements = queryAll(param);
			for (const element of elements) {
				this.push(element);
			}
		}
	}

	ready(cb: () => void) {
		const isReady = this.some((e) => {
			return e.readyState != null && e.readyState != 'loading';
		});
		if (isReady) {
			cb();
		} else {
			this.on('DOMContentLoaded', cb);
		}
		return this;
	}

	on(event: string, cbOrSelector: (e: Event) => void | Promise<void> | string, cb?: (e: Event) => void) {
		if (typeof cbOrSelector === 'function') {
			this.forEach((e) => e.addEventListener(event, cbOrSelector));
		} else if (cbOrSelector) {
			this.forEach((elem) => {
				elem.addEventListener(event, (e: Event) => {
					if (e.target instanceof Element) {
						if (e.target.matches(cbOrSelector)) if (cb) cb(e);
					}
				});
			});
		}
		return this;
	}

	text(text?: string) {
		if (text) {
			this.forEach(e => {
				e.textContent = text;
			})
		} else {
			return this[0].textContent;
		}
		return this;
	}

	removeClass(className: string) {
		this.forEach(e => e.classList.remove(className));
		return this;
	}

	addClass(className: string) {
		this.forEach(e => e.classList.add(className));
		return this;
	}

	css(property: string, value: string | number) {
		const camelProp = property.replace(/(-[a-z])/, (g) => {
			return g.replace('-', '').toUpperCase();
		});
		this.forEach(e => {
			e.style[camelProp] = value;
		});
		return this;
	}
}

const init = function (param?: any) {
	return new ElementCollection(param);
};

export const jquery = init;
export const $ = init;