import halloweenstyle from "@/styles/holidays/halloween.css?url";

const queryAll = (q: string, c = document) => c.querySelectorAll(q);

export const main_halloween = () => {
  document.querySelectorAll("p").forEach((e) => {
    if (typeof e !== "string") {
      e.classList.add("halloween");
      if (e.classList.contains("holidays")) {
        e.classList.add("butcherman");
      }
    } else {
      const elementsToModify = queryAll(e);
      elementsToModify.forEach((element) => {
        element.classList.add("halloween");
      });
    }
  });
  if (!main_halloween.once) {
    import(halloweenstyle);
    main_halloween.once = true;
  }
};

main_halloween.once = false;
