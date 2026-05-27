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
