/**
 * Hacker text animation effect. Progressively reveals the target text by replacing random
 * characters at each tick, creating a "matrix decode" visual effect.
 *
 * @param element - The DOM element to animate text into
 * @param targetText - The final text to reveal
 * @param letters - Character set for random replacements (default: A-Z)
 * @param delay - Milliseconds between each animation tick (default: 30)
 * @param iterations - Speed factor: higher = faster reveal (default: 1.5)
 */
const hackerText = (
  element: HTMLElement,
  targetText: string,
  letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).join(""),
  delay = 30,
  iterations = 1.5,
): void => {
  let iteration = 0;
  const targetLength = targetText.length;

  const intervalId = window.setInterval(() => {
    let output = "";

    for (let i = 0; i < targetLength; i++) {
      output += i < iteration ? targetText[i] : letters[(Math.random() * letters.length) | 0];
    }

    element.innerText = output;

    iteration += 1 / iterations;

    if (iteration >= targetLength) {
      element.innerText = targetText;
      clearInterval(intervalId);
    }
  }, delay);
};

export default hackerText;
