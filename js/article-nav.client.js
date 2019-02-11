window.modules["article-nav.client"] = [function(require,module,exports){/* jshint strict: true, browser: true */
'use strict';

var dom = require(1),
    _throttle = require(23),
    $visibility = require(26),
    $popup = require(40),
    $gtm = require(41);

DS.controller('article-nav', [function () {
  return function (el) {
    var pageHeader = dom.find('.page-header'),
        articleContent = dom.find('.article-content'),
        deepScrollHeadline = dom.find(el, '.deepscroll-headline'),
        deepScrollRubric = dom.find(el, '.deepscroll-rubric'),
        deepScrollRubricSponsored = dom.find(el, '.deepscroll-rubric-sponsored'),
        rubric = dom.find('.article .article-header .rubric'),
        artNavDiv = dom.find('#deepscroll_center_divider'),
        firstPara = dom.find('.clay-paragraph'),
        logo = dom.find(el, '.logo'),
        dynCutLogo = dom.find(el, '.dyn-cut-logo'),
        articleNavTop = dom.find(el, '.article-nav-top'),
        articleNavDS = dom.find(el, '.article-nav-deepscroll'),
        canonicalEl = dom.find('link[rel="canonical"]'),
        shareURL = canonicalEl && canonicalEl.getAttribute('href'),
        shareImg = dom.find('meta[property="og:image"]') ? dom.find('meta[property="og:image"]').getAttribute('content') : '',
        shareTitle = dom.find('meta[property="og:title"]') ? dom.find('meta[property="og:title"]').getAttribute('content') : '',
        shareFacebook = dom.find(el, '.share-link.facebook'),
        shareTwitter = dom.find(el, '.share-link.twitter'),
        sharePinterest = dom.find(el, '.share-link.pinterest'),
        simpleHeader = el.classList.contains('header-simple'),
        targetFlexBasis = window.getComputedStyle(logo, null).getPropertyValue('--targetFlexBasis'),
        verticalStart = window.getComputedStyle(logo, null).getPropertyValue('--verticalStart') || 0,
        verticalEnd = window.getComputedStyle(logo, null).getPropertyValue('--verticalEnd') || 0,
        skipAnimation = false;
    init();

    function init() {
      var throttledScroll = _throttle(checkScrollPos, 30);

      dom.findAll(el, '.share-link').forEach(function (shareLink) {
        return shareLink.addEventListener('click', shareLinkClickHandler);
      });
      setShareLinks();

      if (simpleHeader) {
        return;
      }

      window.addEventListener('scroll', throttledScroll);
      window.addEventListener('resize', resizeItems);

      if (rubric) {
        if (rubric.classList.contains('rubric-sponsor-story') && deepScrollRubricSponsored) {
          deepScrollRubric.classList.remove('visible');
          deepScrollRubricSponsored.classList.add('visible');
          deepScrollRubricSponsored.textContent = rubric.text || rubric.textContent;
        } else {
          deepScrollRubric.textContent = rubric.text || rubric.textContent;
          deepScrollRubric.href = rubric.href || '#';
        }
      } else {
        artNavDiv.style.display = 'none';
        deepScrollRubric.style.display = 'none';
      }

      resizeItems();
      deepScrollHeadline.textContent = shareTitle;
    }

    function resizeItems() {
      skipAnimation = false;
      checkScrollPos();
    }
    /**
     * shareURl pulled from page canonical href
     * shareTitle pulled from page meta tag og:title
     * shareImg pulled from page meta tag og:image
     */


    function setShareLinks() {
      // HOW TO IDENTIFY CAMPAIGN FOR TRACKING CORRECTLY?
      if (shareFacebook) {
        shareFacebook.href = 'http://www.facebook.com/sharer/sharer.php?u=' + shareURL + '?utm_source=fb&utm_medium=s3&utm_campaign=sharebutton-t';
      }

      if (shareTwitter) {
        shareTwitter.href = 'https://twitter.com/share?text=' + encodeURIComponent(shareTitle) + '&url=' + shareURL + '?utm_source=tw&utm_medium=s3&utm_campaign=sharebutton-t&via=' + shareTwitter.getAttribute('data-handle');
      }

      if (sharePinterest) {
        sharePinterest.href = 'http://pinterest.com/pin/create/button/?url=' + shareURL + '?utm_source=pin&utm_medium=s3&utm_campaign=sharebutton-t&description=' + encodeURIComponent(shareTitle) + '&media=' + shareImg;
      }
    }
    /**
     * determine whether or not the nav should be displaying 'deep-nav' content
     * true when element top with 'body' class passes above viewport
     * @return {boolean}
     */


    function shouldShowDeep() {
      var firstParaBnd = !firstPara ? 0 : $visibility.getPageOffset(firstPara).top - 70,
          bodyTop = $visibility.getPageOffset(articleContent).top,
          trigCutt = Math.max(bodyTop, firstParaBnd),
          scrollY = Math.max(window.scrollY, document.body.scrollTop);
      return scrollY >= trigCutt;
    }
    /**
     * toggle class 'deep-scroll' after position check
     * toggle class 'after-scroll' after position check
     * Calculate and animate between the start & end for the logo's FlexBasis. The values
     * are set in the site article-nav.css as --baseFlexBasis & --targetFlexBasis.
     * Same apporach used for nav bar's top value using --verticalStart & --verticalEnd
     */


    function checkScrollPos() {
      var _el$getBoundingClient = el.getBoundingClientRect(),
          top = _el$getBoundingClient.top,
          baseFlexBasis = window.getComputedStyle(logo, null).getPropertyValue('--baseFlexBasis'),
          diffFlexBasis = baseFlexBasis - targetFlexBasis,
          rangePercActual = (pageHeader.getBoundingClientRect().top - 55) / -106,
          rangePerc = Math.abs(rangePercActual),
          diffVertical = verticalStart - verticalEnd - 2,
          newTop = Math.round(verticalStart - (diffVertical * rangePerc + 2)),
          newFlexBasis = Math.ceil(baseFlexBasis - diffFlexBasis * rangePerc); // prevent logo "shrinkage" when scrolling up past page boundry on Safari


      if (rangePercActual < 0) {
        newFlexBasis = baseFlexBasis;
        newTop = verticalStart;
      } // set viewport's maximum width [768, 1180] to cancel animation. also check breakpoint in component css to only show deep-scroll


      skipAnimation = $visibility.getViewportWidth() < 1180;

      if (skipAnimation === true) {
        articleNavTop.style.top = verticalEnd + 'px';
        articleNavDS.style.top = verticalEnd + 'px';
        logo.style.flexBasis = targetFlexBasis + 'px';
        return;
      }

      articleNavTop.style.top = newTop + 'px';
      articleNavDS.style.top = newTop + 'px';
      logo.style.flexBasis = newFlexBasis + 'px';

      if (dynCutLogo) {
        dynCutLogo.style.flexBasis = newFlexBasis + 'px';
      }

      window.scrollY > top ? el.classList.add('after-scroll') : el.classList.remove('after-scroll');
      window.scrollY > top ? pageHeader.classList.add('header-after-scroll') : pageHeader.classList.remove('header-after-scroll');

      if ($visibility.getViewportWidth() >= 1180 && articleContent && shouldShowDeep()) {
        el.classList.add('deep-scroll');
      } else {
        el.classList.remove('deep-scroll');
      }
    }

    function shareLinkClickHandler(e) {
      var target = e.currentTarget,
          url = target.getAttribute('href'),
          handle = target.getAttribute('data-handle'),
          popClass = $popup.getPopupClass(target.classList),
          clickLocation = $visibility.isBelowPrimaryContent(target) ? 'bottom' : 'top';
      $gtm.reportNow({
        event: 'social-share-widget',
        clickLocation: clickLocation,
        socialNetwork: popClass // careful of changes b/c this value goes into analytics

      });

      if ($visibility.getViewportWidth() >= 768 && popClass) {
        e.preventDefault();
        $popup.popWindow(popClass, handle, url);
      } // on mobile, we just open the link like normal

    }
  };
}]);
}, {"1":1,"23":23,"26":26,"40":40,"41":41}];
