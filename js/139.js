window.modules["139"] = [function(require,module,exports){'use strict';

var debounce = require(107);
/**
 * Makes an element sticky when the user scrolls past it. Unsticks the element when the user scrolls past the
 * end of its parent element.
 */


function stick(ele) {
  var stuck = false,
      placeholder,
      // An empty DOM element to take the place of the sticky element so the positions of siblings are not affected
  startY,
      // The starting offset from the top of the document from which ele should be sticky
  endY,
      // The ending offset from rom the top of the document from which ele should be sticky
  initialPosition = ele.style.position,
      // A function to update startY and endY. Runs at the start of scrolling so that the stick function
  // reflects post-initialization DOM changes. Debounced for performance.
  updateScrollRange = debounce(function () {
    var bounds = ele.parentNode.getBoundingClientRect();
    startY = (stuck ? placeholder : ele).getBoundingClientRect().top + window.pageYOffset, endY = bounds.top + bounds.height + window.pageYOffset;
  }, 500, true);
  window.addEventListener('scroll', function () {
    var scrollTop = window.pageYOffset;
    updateScrollRange(); // Update startY and endY

    if (scrollTop > startY && scrollTop < endY) {
      // If in the scroll range and stuck, stick
      if (stuck === false) {
        ele.style.position = 'fixed';
        ele.style.top = '0px';
        ele.classList.add('sticky');
        stuck = true; // create and insert a placeholder

        placeholder = document.createElement('div');
        placeholder.style.width = '100%';
        placeholder.style.height = ele.clientHeight + 'px';
        ele.parentNode.insertBefore(placeholder, ele);
      } // If outside the scroll range and stuck, unstick

    } else if (stuck) {
      ele.style.position = initialPosition;
      ele.classList.remove('sticky');
      stuck = false;
      placeholder.parentNode.removeChild(placeholder);
    }
  });
}

module.exports = stick;
}, {"107":107}];
