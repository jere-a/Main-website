import halloweenstyle from "@/styles/holidays/halloween.css?url";

const queryAll = (q: string, c = document) => c.querySelectorAll(q);

export const main_halloween = async () => {
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
  import(halloweenstyle);
};
