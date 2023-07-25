// Component Accordion
(function() {
	const animate_options = el => { return { easing: "ease-in-out", duration: window.matchMedia("(prefers-reduced-motion: no-preference)").matches ? (el.dataset.duration * 1000 || getComputedStyle(el).getPropertyValue('--duration') * 1000 || 200) : 0 } };
	const accordionContent = el => el.querySelector(":scope > .n-accordion__content");
	const openAccordion = (el) => {
		el = accordionContent(el);
		window.requestAnimationFrame(() => {
			el.style.height = 0;
			el.style.overflow = "hidden";
			let wrapper = el.parentNode;
			wrapper.querySelector(":scope > .n-accordion__label button").setAttribute("aria-expanded", true);
			wrapper.dataset.expanded = true;
			el.animate([{ height: 0 }, { height: `${el.scrollHeight}px` }], animate_options(wrapper)).onfinish = () => {
				el.style.height = el.style.overflow = "";
			};
		});
	};
	const closeAccordion = (el, callback) => {
		el = accordionContent(el);
		window.requestAnimationFrame(() => {
			el.style.overflow = "hidden";
			let wrapper = el.parentNode;
			el.animate([{ height: `${el.scrollHeight}px` }, { height: 0 }], animate_options(wrapper)).onfinish = () => {
				el.style.height = el.style.overflow = "";
				wrapper.querySelector(":scope > .n-accordion__label button").setAttribute("aria-expanded", false);
				delete wrapper.dataset.expanded;
				typeof callback !== 'function' || callback();
				if (wrapper.classList.contains('n-accordion--close-nested')) {
					el.querySelectorAll(".n-accordion__label button[aria-expanded='true']").forEach(el => el.setAttribute("aria-expanded", false));
					el.querySelectorAll(".n-accordion").forEach(el => delete el.dataset.expanded);
				}
			};
		});
	};
	const toggleAccordion = (e) => {
		let el = e.target.closest('.n-accordion');
		if (!el.dataset.expanded) {
			let popin = el.closest(".n-accordion__popin");
			const updateRow = () => {
				if (popin) {
					let row = Math.floor(([...popin.children].indexOf(el) / getComputedStyle(popin).getPropertyValue("--n-popin-columns")) * 1) + 2;
					popin.style.setProperty("--n-popin-open-row", row);
				}
			};
			if (el.parentNode.matches('[role="group"]') || popin) {
				let other_accordion = el.parentNode.querySelector(":scope > .n-accordion[data-expanded]");
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
			let button = el.querySelector(':scope > .n-accordion__label button');
			button.addEventListener("click", toggleAccordion);
			if (button.getAttribute('aria-expanded') === 'true') {
				el.dataset.expanded = true;
			} else {
				button.setAttribute('aria-expanded', false);	
			}
		});
	}
	const doInit = () => {
		(typeof nui !== 'undefined' && typeof nui.registerComponent === "function") ? nui.registerComponent("n-accordion", init): init();
	};
	if (document.readyState !== "loading") {
		doInit();
	} else {
		document.addEventListener("DOMContentLoaded", doInit);
	}
})();