// Component Accordion
(function() {
	const animate_options = el => { return { easing: "ease-in-out", duration: window.matchMedia("(prefers-reduced-motion: no-preference)").matches ? (el.dataset.duration * 1000 || getComputedStyle(el).getPropertyValue('--duration') * 1000 || 200) : 0 } };
	const openAccordion = (el, callback) => {
		el = el.querySelector(":scope > .n-accordion__content");
		window.requestAnimationFrame(() => {
			el.style.height = 0;
			el.style.overflow = "hidden";
			el.parentNode.setAttribute("aria-expanded", true);
			el.animate([{ height: 0 }, { height: `${el.scrollHeight}px` }], animate_options(el.parentNode)).onfinish = () => {
				el.style.height = el.style.overflow = "";
				typeof callback !== 'function' || callback();
			};
		});
	};
	const closeAccordion = (el, callback) => {
		el = el.querySelector(":scope > .n-accordion__content");
		window.requestAnimationFrame(() => {
			// el.parentNode.open = true;
			el.style.overflow = "hidden";
			el.animate([{ height: `${el.scrollHeight}px` }, { height: 0 }], animate_options(el.parentNode)).onfinish = () => {
				el.style.height = el.style.overflow = "";
				el.parentNode.removeAttribute("aria-expanded");
				typeof callback !== 'function' || callback();
			};
		});
	};
	const toggleAccordion = (e) => {
		let el = e.target.parentNode; // el = .n-accordion
		if (!el.getAttribute('aria-expanded')) {
			let container = el.closest(".n-accordion__popin");
			if (container) {
				let row = Math.floor(([...container.children].indexOf(el) / getComputedStyle(container).getPropertyValue("--n-popin-columns")) * 1) + 2;
				container.style.setProperty("--n-popin-open-row", row);
			}
			if (el.parentNode.matches('.n-accordion__group') || container) {
				let other_accordion = el.parentNode.querySelector(":scope > [aria-expanded]");
				if (other_accordion) {
					closeAccordion(other_accordion, () => { // el = .n-accordion
						console.log(el);
						openAccordion(el);
					});
				} else {
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