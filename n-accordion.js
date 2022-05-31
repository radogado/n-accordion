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
			wrapper.setAttribute("data-expanded", true);
			wrapper.querySelector(":scope > .n-accordion__label button").setAttribute("aria-expanded", true);
			el.animate([{ height: 0 }, { height: `${el.scrollHeight}px` }], animate_options(wrapper)).onfinish = () => {
				el.style.height = el.style.overflow = "";
			};
		});
	};
	const closeAccordion = (el, callback) => {
		el = accordionContent(el);
		window.requestAnimationFrame(() => {
			// el.parentNode.open = true;
			el.style.overflow = "hidden";
			let wrapper = el.parentNode;
			el.animate([{ height: `${el.scrollHeight}px` }, { height: 0 }], animate_options(wrapper)).onfinish = () => {
				el.style.height = el.style.overflow = "";
				wrapper.removeAttribute("data-expanded");
				wrapper.querySelector(":scope > .n-accordion__label button").removeAttribute("aria-expanded");
				typeof callback !== 'function' || callback();
			};
		});
	};
	const toggleAccordion = (e) => {
		let el = e.target.closest('.n-accordion'); // el = .n-accordion
		if (!el.getAttribute('data-expanded')) {
			let popin = el.closest(".n-accordion__popin");
			const updateRow = () => {
				if (popin) {
					let row = Math.floor(([...popin.children].indexOf(el) / getComputedStyle(popin).getPropertyValue("--n-popin-columns")) * 1) + 2;
					popin.style.setProperty("--n-popin-open-row", row);
				}
			};
			if (el.parentNode.matches('[role="group"]') || popin) {
				let other_accordion = el.parentNode.querySelector(":scope > [data-expanded]");
				if (other_accordion) {
					closeAccordion(other_accordion, () => { // el = .n-accordion
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
		});
	}
	const doInit = () => {
		typeof registerComponent === "function" ? registerComponent("n-accordion", init) : init();
	};
	if (document.readyState !== "loading") {
		doInit();
	} else {
		document.addEventListener("DOMContentLoaded", doInit);
	}
})();