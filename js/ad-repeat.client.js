window.modules["ad-repeat.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _head = require(25),
    _last = require(24);

DS.controller('ad-repeat', ['$module', function ($module) {
  /*
   * How to use ad-repeat:
   *
   * In the data
   *   `top` is the name of the component that you want ads alongside. Ads start at the top of this component and end at the bottom of this component.
   *   `bottom` is optional. If set, the ads will end at the bottom of this component.
   *   `gap` is the number of pixels between the ads.
   *   `adToRepeat` contains the ad to be cloned and repeated (refer to the ad component).
   *
   * Events:
   *   If you have an element that changes the story height (e.g. "show more" button), make sure to fire the heightChange event
   *
   *   Trigger more ads after height change: document.dispatchEvent(new Event('nym.heightChange'));
   *
   *   Trigger a total refresh of right col ads: document.dispatchEvent(new Event('nym.refreshAdRepeat'));
   */

  /**
   * Calculate size of the ad container.
   * @param {Element} el
   * @return {object} for the ad container: {"top": int, "height": int, "el": {container dom el}}
   */
  function calcAdContainer(el) {
    var container = dom.getPos(el),
        noHigherThan,
        noLowerThan,
        topConstraintEl,
        topConstraintName,
        topConstraint,
        bottomConstraintEl,
        bottomConstraintName,
        bottomConstraint,
        finalDimensions;

    if (!container) {
      return false;
    }

    noHigherThan = 0;
    noLowerThan = 0;
    finalDimensions = {
      marginTop: 0,
      height: 0,
      heightFilledWithAds: 0
    }; // Top constraint. The element that the ads appear alongside. e.g. the story.

    topConstraintName = el.getAttribute('data-top-constraint');
    topConstraintEl = _head(document.querySelectorAll('.' + topConstraintName));

    if (topConstraintEl) {
      topConstraint = dom.getPos(topConstraintEl);
    }

    if (topConstraint) {
      noHigherThan = topConstraint.top;
      noLowerThan = topConstraint.bottom;
    } // Bottom constraint (optional). Ads should not appear below the bottom of this element. e.g. comments section.


    bottomConstraintName = el.getAttribute('data-bottom-constraint');
    bottomConstraintEl = _last(document.querySelectorAll('.' + bottomConstraintName));

    if (bottomConstraintEl) {
      bottomConstraint = dom.getPos(bottomConstraintEl);
    }

    if (bottomConstraint) {
      noLowerThan = bottomConstraint.bottom;
    } // Position.


    if (container.top > noLowerThan) {
      return false;
    }

    if (container.top < noHigherThan) {
      finalDimensions.marginTop = noHigherThan - container.top;
      container.top = noHigherThan;
    }

    finalDimensions.height = Math.max(0, noLowerThan - container.top);
    return finalDimensions;
  }

  function makeId() {
    var idText = '',
        idPossible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        newNumber,
        newIndex,
        i;

    for (i = 0; i < 5; i++) {
      newNumber = Math.random() * idPossible.length, newIndex = Math.floor(newNumber);
      idText += idPossible.charAt(newIndex);
    }

    return idText;
  }

  function insertAds(ad, options) {
    var gap = options.gap,
        adHeight = options.adHeight,
        dimensions = options.dimensions,
        parentContainer = options.parentContainer,
        fragment,
        totalAds,
        i,
        ads,
        newAd,
        newId;

    if (dimensions.height > gap) {
      fragment = document.createDocumentFragment();
      totalAds = Math.floor(dimensions.height / (gap + adHeight));
      dimensions.heightFilledWithAds = totalAds * (gap + adHeight); // i is set to the number of ads already in the ad container in case this function was already run.

      for (i = parentContainer.querySelectorAll('.ad').length; i < totalAds; i++) {
        fragment.appendChild(ad.cloneNode(false), i);
      } // fragmentClone = fragment.cloneNode(true);


      parentContainer.appendChild(fragment);
      parentContainer.classList.add('visible');
      parentContainer.classList.remove('hidden');
      ads = parentContainer.querySelectorAll('.ad');

      for (i = 0; i < ads.length; i++) {
        newAd = ads[i];

        if (!newAd.getAttribute('id')) {
          // new ads don't have IDs
          // add new id so that we can target to the ads
          newId = 'ad-cid-' + makeId();
          newAd.setAttribute('id', newId); // instantiate new ad controllers for each new ad element

          $module.get('ad', newAd);
        }
      } // Set ad-repeat parentContainer height so that vertical divider line looks good.


      parentContainer.style.height = dimensions.height + 'px';
      parentContainer.style.top = dimensions.marginTop + 'px';
    } else {
      // Hide the ad if the article is too short
      parentContainer.classList.add('hidden');
    }
  }

  function AdRepeat(el) {
    var styles = getComputedStyle(el),
        dimensions,
        gap,
        adToClone,
        adHeight,
        adClone;

    if (styles.display === 'block') {
      dimensions = calcAdContainer(el);
      gap = parseInt(el.getAttribute('data-gap')); // One ad exists in the HTML nunjucks template. We need to update the margin of that first ad and clone it.
      // The margin-top is used to space the ads.
      // The height of each ad dimensions is the tallest possible ad size as defined in the data-sizes attribute.

      adToClone = el.querySelector('.ad');
      adHeight = parseInt((adToClone.getAttribute('data-sizes') || '0').replace(/[0-9]+x/g, '').split(',').sort(function (a, b) {
        return a - b;
      })[0]); // old code

      adClone = adToClone.cloneNode(false);
      adClone.removeAttribute('id');
      insertAds(adClone, {
        gap: gap,
        adHeight: adHeight,
        dimensions: dimensions,
        parentContainer: el
      }); // add listeners
      // Add listener to check if the ad container needs more ads.

      document.addEventListener('nym.heightChange', function () {
        var updatedDimensions = calcAdContainer(el); // Lengthening: Add more ads.

        if (updatedDimensions.height - dimensions.heightFilledWithAds >= gap) {
          dimensions = updatedDimensions;
          insertAds(adClone, {
            gap: gap,
            adHeight: adHeight,
            dimensions: dimensions,
            parentContainer: el
          });
        } // Todo: Shortening: Remove ads.

      }); // Add listener to refresh all of the ads in the ad container.

      document.addEventListener('nym.refreshAdRepeat', function () {
        if (adClone) {
          // Destroy current ads.
          dom.clearChildren(el); // Repopulate ads.

          dimensions = calcAdContainer(el);
          insertAds(adClone, {
            gap: gap,
            adHeight: adHeight,
            dimensions: dimensions,
            parentContainer: el
          });
        }
      });
    }
  }

  ;
  return AdRepeat;
}]);
}, {"1":1,"24":24,"25":25}];
