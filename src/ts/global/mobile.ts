//import bowser from 'bowser';

export function detectTouchscreen(): boolean {
	let result = false;
	if (window.PointerEvent && 'maxTouchPoints' in navigator) {
		// if Pointer Events are supported, just check maxTouchPoints
		if (navigator.maxTouchPoints > 0) {
			result = true;
		}
	} else if (window.matchMedia && window.matchMedia('(any-pointer:coarse)').matches) {
		// no Pointer Events...
		// check for any-pointer:coarse which mostly means touchscreen
		result = true;
	} else if (window.TouchEvent || 'ontouchstart' in window) {
		// last resort - check for exposed touch events API / event handler
		result = true;
	}
	return result;
}

export const isMobile = (): boolean => {
	//const browser = bowser.parse(window.navigator.userAgent);

	/*if (
		typeof browser.platform.type === 'string' &&
		browser.platform.type != 'desktop' &&
		detectTouchscreen()
	) {
		return true;
	} else {
		return false;
		}*/
	return false;
};
