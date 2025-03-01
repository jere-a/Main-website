const hackerText = (element: HTMLElement, originalString: string, firstRun: boolean = false, letters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", delay: number = 30, iterations: number = 1.5) => {
  let interval: NodeJS.Timeout | string | number | undefined = undefined;
  const event = new Event('run');
  
  element.addEventListener('run', (event) => {
    let iteration = 0;
  
    clearInterval(interval);
  
    const target = event.target !== null ? event.target as HTMLElement : null;
    if (!target) return;
  
    const originalText = target.innerText;
    interval = setInterval(() => {
      target.innerText = originalText
        .split("")
        .map((_letter, index) => {
          if (index < iteration) {
            return originalString[index];
          }
  
          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");
  
      const originalTextLength = originalString.length;
      if (originalTextLength) {
        iteration >= originalTextLength && clearInterval(interval);
      }
  
      iteration += 1 / iterations;
    }, delay);
  });
  
  element.addEventListener('mouseover', () => {
    element.dispatchEvent(event);
  });
  if (firstRun) {
    element.dispatchEvent(event);
  }
}

export default hackerText;