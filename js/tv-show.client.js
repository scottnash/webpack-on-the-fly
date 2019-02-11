window.modules["tv-show.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    lazyLoad = require(94),
    SEASON_REGEX = /season[0-9]+/,
    $visibility = require(26);

module.exports = function (el) {
  var seeAllButton = el.querySelector('.see-all-button'),
      seeAllElement = el.querySelector('.see-all'),
      paginationButtons = el.querySelectorAll('.pag-button'),
      seasons = el.querySelectorAll('.season'),
      latestSeason = el.querySelector('.latest-season'),
      givenDeskopHeight = 507,
      givenMobileHeight = 1345,
      breakPoint = 768;
  window.addEventListener('load', function () {
    seasons.forEach(function (season) {
      if (latestSeason !== season) {
        setLazyLoader(season);
      }

      season.addEventListener('focus', showEpisodesOnFocus, true);
    });

    if (latestSeason && window.innerWidth < breakPoint && latestSeason.offsetHeight > givenMobileHeight) {
      seeAllElement.classList.remove('hide-from-view');
      latestSeason.classList.add('fade-out-mobile');
    } else if (latestSeason && window.innerWidth >= breakPoint && latestSeason.offsetHeight > givenDeskopHeight) {
      seeAllElement.classList.remove('hide-from-view');
      latestSeason.classList.add('fade-out-desktop');
    }
  });
  seeAllButton.addEventListener('click', showMoreEpisodesOnClick);
  paginationButtons.forEach(function (btn) {
    return btn.addEventListener('click', displayArticlesFromThisSeason);
  });
  /**
   * For accessibility reasons- if we tab into a season that is collapsed,
   * we want to expand that season and hide the see all button
   * @param {Object} e
   */

  function showEpisodesOnFocus(e) {
    if (e.target && e.target.matches('.link-text')) {
      e.target.closest('.season').classList.remove('fade-out-desktop', 'fade-out-mobile');
      seeAllElement.classList.add('hide-from-view');
    }
  }
  /**
   * when we click the see all button, reveal all episodes and hide see all button
   */


  function showMoreEpisodesOnClick() {
    latestSeason.classList.remove('fade-out-desktop', 'fade-out-mobile');
    seeAllElement.classList.add('hide-from-view');
  }
  /**
   * Set lazy load for a season
   * @param {string} season
   */


  function setLazyLoader(season) {
    var seasonClass = SEASON_REGEX.exec(season.className) || '',
        sources = dom.findAll(el, ".".concat(seasonClass, " source[data-srcset]")),
        img = dom.find(el, ".".concat(seasonClass, " img[data-src]")),
        wrapper = dom.find(el, ".".concat(seasonClass, " .episode-image"));
    var lazyLoader = new lazyLoad.LazyLoader(wrapper, img, sources);
    lazyLoader.init();
  }
  /**
   * Captures a value from the click event which holds a season number
   * we hide the see all button and all seasons, except the season number which we click on
   * @param {Object} e
   */


  function displayArticlesFromThisSeason(e) {
    var clickEv = e.target || e.srcElement,
        clickValue = clickEv.dataset.season,
        showThisSeason = el.querySelector(".season".concat(clickValue));
    latestSeason.classList.remove('fade-out-desktop', 'fade-out-mobile');
    seeAllElement.classList.add('hide-from-view');
    paginationButtons.forEach(function (b) {
      return b.setAttribute('aria-pressed', false);
    });
    clickEv.setAttribute('aria-pressed', true);
    seasons.forEach(function (v) {
      return v.classList.add('hide-from-view');
    });
    showThisSeason.classList.remove('hide-from-view');
    $visibility.updateVisibility();
  }
};
}, {"1":1,"26":26,"94":94}];
