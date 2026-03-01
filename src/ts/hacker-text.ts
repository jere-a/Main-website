const hackerText = (
  element: HTMLElement,
  originalString: string,
  firstRun = false,
  letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  delay = 30,
  iterations = 1.5,
): void => {
  let interval: ReturnType<typeof setInterval> | undefined;

  const run = (): void => {
    let iteration = 0;
    clearInterval(interval);
    const originalText = element.innerText;

    interval = setInterval(() => {
      element.innerText = originalText
        .split("")
        .map((_, i) =>
          i < iteration
            ? originalString[i]
            : letters[Math.floor(Math.random() * letters.length)],
        )
        .join("");

      if (iteration >= originalString.length) clearInterval(interval);
      iteration += 1 / iterations;
    }, delay);
  };

  element.addEventListener("mouseover", run);
  if (firstRun) run();
};

export default hackerText;
