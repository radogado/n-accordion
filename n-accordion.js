// Component Accordion
(function () {
  const animate_options = (el) => {
    return {
      easing: "ease-in-out",
      duration: window.matchMedia("(prefers-reduced-motion: no-preference)")
        .matches
        ? parseFloat(el.dataset.duration) * 1000 ||
          parseFloat(getComputedStyle(el).getPropertyValue("--duration")) * 1000 ||
          200
        : 0,
    };
  };
  const accordionContent = (el) =>
    el.querySelector(":scope > .n-accordion__content");
  const openAccordion = (el) => {
    el = accordionContent(el);
    if (!el) return;
    window.requestAnimationFrame(() => {
      el.style.height = 0;
      el.style.overflow = "hidden";
      let wrapper = el.parentNode;
      const button = wrapper?.querySelector(
        ":scope > .n-accordion__label button",
      );
      if (button) button.setAttribute("aria-expanded", true);
      wrapper.dataset.expanded = true;
      el.animate(
        [{ height: 0 }, { height: `${el.scrollHeight}px` }],
        animate_options(wrapper),
      ).onfinish = () => {
        el.style.height = el.style.overflow = "";
      };
    });
  };
  const closeAccordion = (el, callback) => {
    el = accordionContent(el);
    if (!el) return;
    window.requestAnimationFrame(() => {
      el.style.overflow = "hidden";
      let wrapper = el.parentNode;
      el.animate(
        [{ height: `${el.scrollHeight}px` }, { height: 0 }],
        animate_options(wrapper),
      ).onfinish = () => {
        el.style.height = el.style.overflow = "";
        const button = wrapper?.querySelector(
          ":scope > .n-accordion__label button",
        );
        if (button) button.setAttribute("aria-expanded", false);
        delete wrapper.dataset.expanded;
        if (typeof callback === "function") callback();
        if (wrapper.classList.contains("n-accordion--close-nested")) {
          el.querySelectorAll(
            ".n-accordion__label button[aria-expanded='true']",
          ).forEach((btn) => btn.setAttribute("aria-expanded", false));
          el.querySelectorAll(".n-accordion").forEach(
            (acc) => delete acc.dataset.expanded,
          );
        }
      };
    });
  };
  const toggleAccordion = (e) => {
    let el = e.target.closest(".n-accordion");
    if (!el) return;
    if (!el.dataset.expanded) {
      let popin = el.closest(".n-accordion__popin");
      const updateRow = () => {
        if (popin) {
          const columns =
            parseFloat(
              getComputedStyle(popin).getPropertyValue("--n-popin-columns"),
            ) || 1;
          let row = Math.floor([...popin.children].indexOf(el) / columns) + 2;
          popin.style.setProperty("--n-popin-open-row", row);
        }
      };
      if (el.parentNode.matches('[role="group"]') || popin) {
        let other_accordion = el.parentNode.querySelector(
          ":scope > .n-accordion[data-expanded]",
        );
        if (other_accordion) {
          closeAccordion(other_accordion, () => {
            updateRow();
            openAccordion(el);
          });
        } else {
          updateRow();
          openAccordion(el);
        }
      } else {
        openAccordion(el);
      }
    } else {
      closeAccordion(el);
    }
  };

  function init(host = document) {
    host.querySelectorAll(".n-accordion:not([data-ready])").forEach((el) => {
      el.querySelector(":scope > input")?.remove(); // Remove CSS-only solution
      el.dataset.ready = true;
      let button = el.querySelector(":scope > .n-accordion__label button");
      if (!button) return;
      button.addEventListener("click", toggleAccordion);
      if (button.getAttribute("aria-expanded") === "true") {
        el.dataset.expanded = true;
      } else {
        button.setAttribute("aria-expanded", false);
      }
    });
  }
  const doInit = () => {
    typeof nui !== "undefined" && typeof nui.registerComponent === "function"
      ? nui.registerComponent("n-accordion", init)
      : init();
  };
  if (document.readyState !== "loading") {
    doInit();
  } else {
    document.addEventListener("DOMContentLoaded", doInit);
  }
})();
