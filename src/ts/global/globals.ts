export function toUnicode(str: string) {
	return str
		.split('')
		.map((char) => {
			const code = char.charCodeAt(0).toString(16).toUpperCase();
			// Pad with zeros to ensure it's 4 digits
			return `\\u${'0'.repeat(4 - code.length) + code}`;
		})
		.join('');
}

export const language = (only_fi: boolean = true) => {
	const lang = window.navigator.language.toLowerCase();
	if (lang === 'fi' || lang === 'fi-fi' || only_fi) {
		return 'fi';
	} else {
		return 'en';
	}
};

export function throttle(cb: Function, delay = 1000) {
	let shouldWait = false;
	let waitingArgs: any;
	const timeoutFunc = () => {
		if (waitingArgs == null) {
			shouldWait = false;
		} else {
			cb(...waitingArgs);
			waitingArgs = null;
			setTimeout(timeoutFunc, delay);
		}
	};

	return (...args: any[]) => {
		if (shouldWait) {
			waitingArgs = args;
			return;
		}

		cb(...args);
		shouldWait = true;

		setTimeout(timeoutFunc, delay);
	};
}

export const injectCSS = (css: string): HTMLStyleElement => {
	let el = document.createElement('style');
	el.innerText = css;
	document.head.appendChild(el);
	return el;
};

export function addCSSFromURL(url: string): void {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
}

export function capitalize(string: string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function addGlobalEventListener(event: any, selector: string | undefined | null, callback: EventListener) {
  document.addEventListener(event, e => {
    if (e.target === null) return;
    const target = e.target as HTMLElement;
    if (selector === undefined || selector === null || target.matches(selector)) callback(e);
  })
}

export const l = (message?: any, ...optionalParams: any[]) => console.log(message, ...optionalParams);