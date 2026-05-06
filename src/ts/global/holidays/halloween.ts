import "@/styles/holidays/halloween.css";

export const main_halloween = async () => {
  document.querySelectorAll("p").forEach((e) => {
    if (typeof e !== "string") {
      e.classList.add("halloween");
      if (e.classList.contains("holidays")) {
        e.classList.add("butcherman");
      }
    } else {
      document.querySelectorAll<HTMLElement>(e).forEach((elem) => {
        elem.classList.add("halloween");
      });
    }
  });
};
