// Component Fold – start

(function (){
    
function toggleAttribute(el, attribute) {

    if (el.getAttribute(attribute)) {

        el.removeAttribute(attribute);

    } else {

        el.setAttribute(attribute, true);

    }

}

function addClass(el, className) {

	el.classList.add(className);

}

/* Chainable animation specified as CSS Animation */

var temp = document.createElement('temp');

var animations = {

	'animation'      	: 'animationend',
	'MozAnimation'   	: 'animationend',
	'WebkitAnimation'	: 'webkitAnimationEnd'

};

for(var t in animations) {

    if (temp.style[t] !== 'undefined') {

        var animationEndEvent = animations[t];

    }

}

function animate(el, animation_code, duration, callback) { // Default duration = .2s, callback optional

// To do: add animation-fill-mode: forwards to keep the end state

	if (!el.getAttribute('data-animation')) {

		el.addEventListener(animationEndEvent, function animationEndHandler(e) {
			
			stopEvent(e);
			var el = e.target; 
			document.head.removeChild(document.querySelector('.' + el.getAttribute('data-animation')));
			el.removeAttribute('data-animation');
	 		el.removeEventListener(animationEndEvent, animationEndHandler);
			if (typeof callback === 'function') {
		
				callback();
		
			}
		
		}, false);

		var animation_name = 'a' + new Date().getTime(); // Unique animation name
		var styles = document.createElement('style');
		styles.innerHTML = '@keyframes ' + animation_name + ' {' + animation_code + '} [data-animation=' + animation_name + '] { animation-name: ' + animation_name + '; animation-duration: ' + ((typeof duration === 'undefined') ? .2 : duration) + 's; }'; // Where animation format is 		0% { opacity: 1 } 100% { opacity: 0 }
		document.head.appendChild(styles);
		addClass(styles, animation_name);

// 		el.dataset.animation = animation_name;
		el.setAttribute('data-animation', animation_name);
	
	}
	
}

function stopEvent(e) {

    if (!e) {

        if (typeof window.event === 'undefined') {

            return;

        }

    }

	if ( typeof e === 'undefined' ) {
		
		return false;

	}

    //e.cancelBubble is supported by IE, this will kill the bubbling process.
    e.cancelBubble = true;
    e.returnValue = false;

    //e.stopPropagation works only in Firefox.
    if (e.stopPropagation) {

        e.stopPropagation();

    }

    if (e.preventDefault) {

        e.preventDefault();

    }

    return false;

}

function hasClass(el, className) {

	return el.classList.contains(className);
	// To do: remove a single '.' for foolproof operation; Support multiple classes separated by space, dot, comma

}

	function toggleAccordion(e) {
	
		stopEvent(e);
	    var el = e.target.closest('.n-accordion');
	    var content = el.querySelector('.content');
	
		content.style.setProperty('--width', content.scrollWidth + 'px');
		content.style.setProperty('--max-height', content.scrollHeight + 'px');
	
		var content_height = content.style.getPropertyValue('--start-height') || 0;
		
		// Animation, not CSS, because of nested accordions
		
		if (hasClass(el, 'horizontal')) {
			
			toggleAttribute(el, 'aria-expanded');
			
		} else {
		
			if (el.hasAttribute('aria-expanded')) {
		
				animate(content, '0% { max-height: ' + content.scrollHeight + 'px; } 100% { max-height: ' + content_height + '; }', .2, function () {
					
					toggleAttribute(el, 'aria-expanded');
					
				});
				
			} else {
				
				toggleAttribute(el, 'aria-expanded');
				animate(content, '0% { max-height: ' + content_height + '; } 100% { max-height: ' + content.scrollHeight + 'px; }');
				
			}
		
		}
	
	    return false;
	
	}
	
	function initFold() {
		
		document.querySelectorAll('.n-accordion:not([data-ready]) > .label').forEach( function(el) {
	
		    el.onclick = toggleAccordion;
			el.setAttribute('tabindex', 0);
			el.onkeyup = function (e) {
		
				if (e.key === 'Enter') {
					
					toggleAccordion(e);
		
				}
				
			};
		
		    el = el.parentNode;
			var content = el.querySelector('.content');
			
			if (hasClass(el, 'horizontal')) {
				
				el.setAttribute('data-init', true);
				content.style.setProperty('--width', content.scrollWidth + 'px');
				content.style.height = 'auto';
				el.removeAttribute('data-init');
				setTimeout(function () { content.style.transition = 'width .2s ease-in-out'; }, 100);
				
			}
		
			content.style.setProperty('--max-height', content.scrollHeight + 'px');
		
		    if (el.querySelector('input.trigger')) { // Remove CSS-only triggers
		
		        el.querySelector('input.trigger').outerHTML = '';
		
		    }
		
		    if (!hasClass(el, 'mobile')) { // Keep the accordion content clickable
			    
			    content.onclick = function(e) {
		
			        stopEvent(e);
			
			    };
		
		    }
		    
		});
		
	}
	
	initFold();

})();

// Component Fold – end
