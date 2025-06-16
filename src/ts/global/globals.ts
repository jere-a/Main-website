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

export const language = (only_fi: boolean = true, lang: string = window.navigator.language) => {
  if (only_fi) {
    return "fi";
  } else {
    return lang.substring(0, 2);
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

export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function addGlobalEventListener(event: any, selector: string | undefined | null, callback: EventListener) {
  document.addEventListener(event, e => {
    if (e.target === null) return;
    const target = e.target as HTMLElement;
    if (selector === undefined || selector === null || target.matches(selector)) callback(e);
  })
}

/**
 * Converts non-ASCII characters in a string to their JavaScript Unicode escape sequences.
 * Characters with a char code >= 128 are converted.
 *
 * @param input - The string to convert.
 * @returns The converted string where non-ASCII characters are replaced with Unicode escapes.
 */
export function convertToUnicodeEscape(input: string): string {
  let output = '';
  for (const char of input) {
    const charCode = char.charCodeAt(0);
    // If the character is a basic ASCII character (0-127), append it unchanged.
    if (charCode < 128) {
      output += char;
    } else {
      // Convert char code to hexadecimal and pad it to 4 digits.
      const hex = charCode.toString(16).padStart(4, '0');
      // Append the unicode escape sequence.
      output += `\\u${hex}`;
    }
  }
  return output;
}

export const l = (message?: any, ...optionalParams: any[]) => console.log(message, ...optionalParams);
