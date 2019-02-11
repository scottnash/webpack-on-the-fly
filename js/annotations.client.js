window.modules["annotations.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _forEach = require(27);

DS.controller('annotations', [function () {
  var Constructor,
      annotatedSelector = '.clay-annotated'; // this is defined in the paragraph wysiswyg schema.

  /**
   *
   * @param {string} componentName
   * @returns {string}
   */

  function componentSelector(componentName) {
    return '[data-uri*="/' + componentName + '/"]';
  }
  /**
   * @param {Element} el
   * @constructor
   * @property {Element} el
   */


  Constructor = function Constructor(el) {
    var ancestorArticle = dom.closest(el, componentSelector('article')),
        annotations = dom.findAll(el, componentSelector('annotation')),
        annotatedPhrases = Array.prototype.slice.call(dom.findAll(ancestorArticle, annotatedSelector));

    _forEach(annotatedPhrases, function (annotatedPhrase, index) {
      var annotation = annotations[index],
          // match phrases and annotations by order in the dom.
      clonedAnnotation;

      if (annotation) {
        clonedAnnotation = annotation.cloneNode(true);
        annotatedPhrase.append(clonedAnnotation); // When focused, show with class

        annotatedPhrase.addEventListener('focus', function () {
          clonedAnnotation.classList.add('show');
        }); // When unfocused, hide with delay
        // This is crucial to give any links that have been clicked a chance to fire

        annotatedPhrase.addEventListener('blur', function () {
          setTimeout(function () {
            clonedAnnotation.classList.remove('show');
          }, 100);
        }); // Show on hover for desktop

        if (window.innerWidth >= 1180) {
          annotatedPhrase.addEventListener('mouseenter', function () {
            annotatedPhrase.focus();
          });
        } // Close on tap for mobile


        if (window.innerWidth < 768) {
          clonedAnnotation.addEventListener('click', function () {
            annotatedPhrase.blur();
          });
        }
      }
    });
  };

  return Constructor;
}]);
}, {"1":1,"27":27}];
