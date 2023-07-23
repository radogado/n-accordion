// Component Accordion
(function() {
	const animate_options = el => { return { easing: "ease-in-out", duration: window.matchMedia("(prefers-reduced-motion: no-preference)").matches ? (el.dataset.duration * 1000 || getComputedStyle(el).getPropertyValue('--duration') * 1000 || 200) : 0 } };
	const accordionContent = el => el.querySelector(":scope > .n-accordion__content");
	const openAccordion = (el) => {
		el = accordionContent(el);
		let wrapper = el.parentNode;
		wrapper.querySelector(":scope > .n-accordion__label").setAttribute("aria-expanded", true);
		// window.requestAnimationFrame(() => {
		// 	el.style.height = 0;
		// 	el.style.overflow = "hidden";
		// 	el.animate([{ height: 0 }, { height: `${el.scrollHeight}px` }], animate_options(wrapper)).onfinish = () => {
		// 		el.style.height = el.style.overflow = "";
		// 	};
		// });
	};
	const closeAccordion = (el, callback) => {
		el = accordionContent(el);
		let wrapper = el.parentNode;
		wrapper.querySelector(":scope > .n-accordion__label").setAttribute("aria-expanded", false);
		typeof callback !== 'function' || callback();
		if (wrapper.classList.contains('n-accordion--close-nested')) {
			el.querySelectorAll(".n-accordion__label[aria-expanded='true']").forEach(el => el.setAttribute("aria-expanded", false));
		}
		// window.requestAnimationFrame(() => {
		// 	el.style.overflow = "hidden";
		// 	el.animate([{ height: `${el.scrollHeight}px` }, { height: 0 }], animate_options(wrapper)).onfinish = () => {
		// 		el.style.height = el.style.overflow = "";
		// 	};
		// });
	};
	const toggleAccordion = (e) => {
		let el = e.target.closest('.n-accordion'); // el = .n-accordion
		if (!el.querySelector(":scope > [aria-expanded='true']")) {
			let popin = el.closest(".n-accordion__popin");
			const updateRow = () => {
				if (popin) {
					let row = Math.floor(([...popin.children].indexOf(el) / getComputedStyle(popin).getPropertyValue("--n-popin-columns")) * 1) + 2;
					popin.style.setProperty("--n-popin-open-row", row);
				}
			};
			if (el.parentNode.matches('[role="group"]') || popin) {
				let other_accordion = el.parentNode.querySelector(":scope > .n-accordion > [aria-expanded='true']");
				if (other_accordion) {
					closeAccordion(other_accordion.parentNode, () => { // el = .n-accordion
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
		host.querySelectorAll(".n-accordion:not([data-ready]) > .n-accordion__label").forEach((el) => {
			el.addEventListener("click", toggleAccordion);
			el.parentElement.querySelector(":scope > input")?.remove(); // Remove CSS-only solution
			el.parentNode.dataset.ready = true;
			el.setAttribute('aria-expanded', el.getAttribute('aria-expanded') === 'true');
		});
	}
	const doInit = () => {
		(typeof nui !== 'undefined' && typeof nui.registerComponent === "function") ? nui.registerComponent("n-accordion", init) : init();
	};
	if (document.readyState !== "loading") {
		doInit();
	} else {
		document.addEventListener("DOMContentLoaded", doInit);
	}
})();