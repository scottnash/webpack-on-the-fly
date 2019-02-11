window.modules["obama-nav.client"] = [function(require,module,exports){'use strict';

var _map = require(37),
    _throttle = require(23);

DS.controller('obama-nav', ['$document', '$window', function ($document, $window) {
  function closestClass(currentEl, className) {
    while ((currentEl = currentEl.parentElement) && !currentEl.classList.contains(className)) {
      ;
    }

    return currentEl;
  }

  function checkVisible(currentSection, years, el) {
    var rect = currentSection.getBoundingClientRect(),
        viewHeight = Math.max($document.documentElement.clientHeight, $window.innerHeight),
        sectionYear;

    if (!(rect.bottom < 0 || rect.top - viewHeight >= 0)) {
      _map(years, function (currentYear) {
        currentYear.classList.remove('current');
      });

      sectionYear = currentSection.dataset.jump.slice(3);
      el.querySelector('.year[data-year="' + sectionYear + '"]').classList.add('current');
    }
  }

  function openAnchorItem(anchor) {
    var anchorItem = $document.querySelector('#' + anchor),
        anchorItemReadMore;

    if (anchorItem) {
      anchorItemReadMore = anchorItem.querySelector('.read-more');

      if (anchorItemReadMore) {
        anchorItemReadMore.classList.add('open');
      }
    }
  }

  function Constructor(el) {
    var adSplashHeight = $document.querySelector('.ad-splash').offsetHeight,
        splashHeaderHeight = $document.querySelector('.splash-header').offsetHeight,
        url = $window.location.href,
        anchor,
        navHeight = 177;
    this.el = el;
    this.fixed = el.querySelector('.sticky-bar');
    this.elTop = el.offsetTop + adSplashHeight + splashHeaderHeight + navHeight;
    this.elBottom = adSplashHeight + splashHeaderHeight + navHeight;
    this.sections = $document.querySelectorAll('.obama-timeline');

    if (url.indexOf('#') > -1) {
      anchor = url.split('#')[1];
      openAnchorItem(anchor);
    }

    $window.addEventListener('scroll', _throttle(this.onScroll.bind(this), 33));
  }

  Constructor.prototype = {
    events: {
      '.year click': 'scrollToSection'
    },
    scrollToSection: function scrollToSection(e) {
      var el = this.el,
          years = el.querySelectorAll('.year'),
          targetEl = closestClass(e.target, 'year'),
          dataYear = targetEl.dataset.year,
          currentYear = 'tl-' + dataYear,
          scrollToEl = $document.querySelector('#' + currentYear);

      _map(years, function (currentYear) {
        currentYear.classList.remove('current');
      });

      targetEl.classList.add('current');
      scrollToEl.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      });
    },
    onScroll: function onScroll() {
      var el = this.el,
          bottom = $document.querySelector('.bottom-share').offsetTop,
          years = el.querySelectorAll('.year'),
          fixed = this.fixed,
          html = $document.documentElement.scrollTop || $document.body.scrollTop,
          stopNavEl = this.elBottom + bottom,
          tlSections = this.sections;

      if (html > this.elTop && html < stopNavEl) {
        fixed.classList.add('sticky');
      } else {
        fixed.classList.remove('sticky');
      }

      _map(tlSections, function (currentSection) {
        checkVisible(currentSection, years, el);
      });
    }
  };
  return Constructor;
}]);
}, {"23":23,"37":37}];
