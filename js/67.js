window.modules["67"] = [function(require,module,exports){/* eslint complexity: ["error", 11] */
'use strict';

var isProduction = require(6)();

function getComponentName(uri) {
  var result = /_components\/(.+?)[\/\.]/.exec(uri) || /_components\/(.*)/.exec(uri);
  return result && result[1];
}
/**
 *
 * @param {DocumentFragment} frag
 * @param {object} opts
 * @param {string} opts.name
 * @param {string} opts.speedbumpDescription
 * @param {string} opts.speedbumpMessage
 * @param {string} opts.speedbumpLink
 * @param {object} baseTrackingData
 */


function insertSpeedBumpComponents(frag, opts, baseTrackingData) {
  var desktopOutStream = document.querySelector('[data-label="outStreamDesktop"]'),
      mobileOutStream = document.querySelector('[data-label="outStreamMobile"]'),
      hasMobileOutStream = mobileOutStream !== null,
      hasDesktopOutStream = desktopOutStream !== null,
      speedBumpConfigurations = {
    mobile: {
      type: 'mobile',
      anchorFinder: function anchorFinder(element) {
        if (hasMobileOutStream) {
          return element && element.dataset && element.dataset.label === 'outStreamMobile';
        } else {
          // when there is no mobile outStream we will use the first ad as our anchor
          return element && element.dataset && element.dataset.sizes && element && element.dataset && element.dataset.label && element.dataset.label.indexOf('Mobile') > -1;
        }
      },
      container: pluckContainer('speed-bump'),
      componentMin: hasMobileOutStream ? 2 : 3,
      wordCountMin: hasMobileOutStream ? 150 : 200,
      // stateful values
      passedAnchor: false,
      componentCounter: 0,
      wordCounter: 0,
      placed: false
    },
    tablet: {
      type: 'tablet',
      anchorFinder: function anchorFinder(element) {
        return element && element.dataset && element.dataset.sizes && element && element.dataset && element.dataset.label && element.dataset.label.indexOf('Tablet') > -1;
      },
      container: pluckContainer('speed-bump_tablet'),
      componentMin: 3,
      wordCountMin: 200,
      // stateful values
      passedAnchor: false,
      componentCounter: 0,
      wordCounter: 0,
      placed: false
    },
    desktop: {
      type: 'desktop',
      anchorFinder: function anchorFinder(element) {
        if (hasDesktopOutStream) {
          return element && element.dataset && element.dataset.label === 'outStreamDesktop';
        } else {
          // for desktop outstream is the only in article ad, thus when there is none detectable
          // we should just start from the beginning of the article content as our anchor
          return true;
        }
      },
      container: pluckContainer('speed-bump_desktop'),
      componentMin: hasDesktopOutStream ? 2 : 3,
      wordCountMin: hasDesktopOutStream ? 150 : 250,
      // stateful values
      passedAnchor: false,
      componentCounter: 0,
      wordCounter: 0,
      placed: false
    }
  },
      articleContentElements = document.querySelector('.article-content').children;

  for (var i = 0; i < articleContentElements.length; i++) {
    var element = articleContentElements[i]; // for mobile insertion

    if (speedBumpConfigurations.mobile) {
      determineInsertionEligibility(speedBumpConfigurations.mobile, element);
    } // for tablet insertion


    if (speedBumpConfigurations.tablet) {
      determineInsertionEligibility(speedBumpConfigurations.tablet, element);
    } // for desktop insertion


    if (speedBumpConfigurations.desktop) {
      determineInsertionEligibility(speedBumpConfigurations.desktop, element);
    }
  }
  /**
   * @typedef {Object} SpeedBumpPlacementConfiguration
   * @param {Function<Boolean>} anchorFinder
   * @param {Object} container
   * @param {Number} componentMin
   * @param {Number} wordCountMin
   * @param {Boolean} passedAnchor
   * @param {Number} componentCounter
   * @param {Number} wordCounter
   * @param {Boolean} placed
   */

  /**
   *
   * @param {SpeedBumpPlacementConfiguration} configuration
   * @param {*} element
   */


  function determineInsertionEligibility(configuration, element) {
    var placed = configuration.placed,
        passedAnchor = configuration.passedAnchor,
        type = configuration.type;

    if (!placed && !passedAnchor) {
      var anchorFinder = configuration.anchorFinder;

      if (anchorFinder(element)) {
        isProduction && console.log("[Paywall-Speed-Bump-Placement]: Found Anchor for ".concat(type), {
          anchor: element
        });
        configuration.passedAnchor = true;
      } // early return as there is nothing more we can do here


      return;
    }

    if (!placed) {
      var elementWordCount = parseInt(element.dataset.wordCount) || 0;
      configuration.wordCounter += elementWordCount;

      if (elementIsIncrementing(element.dataset.uri)) {
        configuration.componentCounter += 1;
      }

      if (configuration.wordCounter >= configuration.wordCountMin || configuration.componentCounter >= configuration.componentMin) {
        isProduction && console.log("[Paywall-Speed-Bump-Placement]: Found Position for ".concat(type), {
          positionAfter: element,
          configuration: configuration
        });
        var container = configuration.container,
            name = opts.name,
            speedbumpDescription = opts.speedbumpDescription,
            speedbumpMessage = opts.speedbumpMessage,
            speedbumpLink = opts.speedbumpLink;
        element.parentNode.insertBefore(container, element.nextSibling);
        configuration.placed = true;

        require("speed-bump.client")(container, {
          name: name,
          speedbumpDescription: speedbumpDescription,
          speedbumpMessage: speedbumpMessage,
          speedbumpLink: speedbumpLink,
          baseTrackingData: baseTrackingData
        });
      }
    }
  }
  /**
   * @param {string} selector 
   * @returns {Node|null}
   */


  function pluckContainer(selector) {
    var element = document.importNode(frag, true),
        topLevel = element.querySelector('.speed-bump');
    topLevel.classList.remove('speed-bump');
    topLevel.classList.add(selector);
    return topLevel;
  }

  function elementIsIncrementing(uri) {
    var componentName = getComponentName(uri);

    if (!componentName) {
      return false;
    }

    if (['divider', 'divider-short', 'related', 'ad'].includes(componentName)) {
      return false;
    }

    return true;
  }
}

module.exports.insertSpeedBumpComponents = insertSpeedBumpComponents;
}, {"6":6,"speed-bump.client":"speed-bump.client"}];
