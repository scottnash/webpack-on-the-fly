window.modules["content-cliff.client"] = [function(require,module,exports){'use strict';

var _require = require(64),
    generateGrowl = _require.generateGrowl,
    auth0 = require(7),
    isProduction = require(6)(),
    _require2 = require(65),
    getLocalStorage = _require2.getLocalStorage,
    setLocalStorage = _require2.setLocalStorage,
    logger = require(66).Logger(function () {
  return !isProduction;
});
/**
 * Find a template element
 * @param {Element} el
 * @param {string} id
 * @return {DocumentFragment}
 */


function findTemplate(el) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var tpl = el && el.querySelector("[data-template-id=\"".concat(id, "\"]"));
  return tpl && tpl.content;
}

module.exports = function (el, opts) {
  /**
   * This component expects to be driven by the choreographer
   * component so it cannot be mounted alone via the traditional
   * mechanism.
   */
  if (!opts) {
    return;
  }

  logger.group();
  logger.h2('Content Cliff');
  var cliffOptions = opts.cliffOptions,
      viewCount = opts.viewCount,
      firstVisit = opts.firstVisit,
      onWarn = opts.onWarn,
      onClickWarn = opts.onClickWarn,
      onShow = opts.onShow,
      onClickCliff = opts.onClickCliff,
      contentCliffWarningTitle = cliffOptions.contentCliffWarningTitle,
      contentCliffWarningBody = cliffOptions.contentCliffWarningBody,
      contentCliffWarningCTA = cliffOptions.contentCliffWarningCTA,
      contentCliffWarningLink = cliffOptions.contentCliffWarningLink,
      contentCliffWarningScrollDepth = cliffOptions.contentCliffWarningScrollDepth,
      msgTemplate = findTemplate(el, 'content-cliff-warning-growl'),
      shortArticleMaxWordCount = 300,
      componentsToHideWithActiveCliff = ['taboola'],
      selector = '#content-cliff',
      cliffElement = el,
      articleWordCount = getArticleWordCount(),
      isFirstSession = differenceInMinutes(new Date(), new Date(firstVisit)) < 30,
      warner = WarningGrowl(msgTemplate, {
    max: 1,
    title: contentCliffWarningTitle,
    body: contentCliffWarningBody,
    cta: contentCliffWarningCTA,
    link: contentCliffWarningLink,
    scrollDepth: contentCliffWarningScrollDepth
  }),
      cliffBehaviors = {
    noop: function noop() {},
    warn: function warn() {
      warner.warn();
    },
    show: function show() {
      onShow();

      _show();
    }
  },
      cliffBehavior = cliffBehaviors[determineCliffBehavior()],
      signInButton = el.querySelector('.content-cliff-login');
  var siblings = [];
  logger.log("should warn via view count: ".concat(warner.shouldWarn(viewCount)));
  logger.log("should noop via first session: ".concat(isFirstSession));
  logger.groupEnd();
  auth0.on('login', function () {
    remove();
  });
  return typeof cliffBehavior === 'function' ? cliffBehavior() : undefined;
  /**
   * Given the settings of the content-cliff determine which
   * content cliff behavior we need to invoke.
   * @returns {string}
   */

  function determineCliffBehavior() {
    if (articleWordCount <= shortArticleMaxWordCount) {
      logger.log("article word count ".concat(articleWordCount, " was too short for the cliff"));
      return 'noop';
    }

    if (isFirstSession) {
      return 'noop';
    }

    if (warner.shouldWarn(viewCount)) {
      return 'warn';
    }

    return 'show';
  }
  /**
   * Show the content cliff
   * Remove sibling elements
   * Remove additional shtuff
   */


  function _show() {
    siblings = collectSiblings(selector);
    siblings.forEach(function (sib) {
      return sib.remove();
    });
    applySettings();
    cliffElement.classList.remove('collapsed');
    suppressComponents(componentsToHideWithActiveCliff);
    signInButton.addEventListener('click', function () {
      return auth0.showLogin();
    });
  }
  /**
   * Remove the content cliff; 
   * re-add removed elements.
   * empty siblings array. 
   */
  // @todo integrate w/ auth0


  function remove() {
    cliffElement.classList.add('collapsed');
    siblings = Array.prototype.slice.call(siblings, 0).reverse();
    siblings.forEach(function (sib) {
      return cliffElement.insertAdjacentElement('afterend', sib);
    });
    siblings = [];
  }
  /**
   * get all the siblings of the content cliff
   * @param {string} sel - HTML selector
   * @return {NodeList}
   */


  function collectSiblings() {
    var sel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return document.querySelectorAll("".concat(sel, " ~ *"));
  }
  /**
   * Insert settings into the cliff.
   *
   * @param {Element} cliffElement
   */


  function applySettings() {
    var contentCliffStatus = cliffOptions.contentCliffStatus,
        contentCliffPromo = cliffOptions.contentCliffPromo,
        contentCliffCTA = cliffOptions.contentCliffCTA,
        contentCliffURL = cliffOptions.contentCliffURL,
        status = el.querySelector('[data-content-cliff-status]'),
        promo = el.querySelector('[data-content-cliff-promo]'),
        cta = el.querySelector('[data-content-cliff-cta]');
    cta && cta.setAttribute('href', contentCliffURL);
    cta && cta.insertAdjacentHTML('afterbegin', contentCliffCTA);
    status && status.insertAdjacentHTML('afterbegin', contentCliffStatus);
    promo && promo.insertAdjacentHTML('afterbegin', contentCliffPromo);
    cta && cta.addEventListener('click', onClickCliff);
  }
  /**
   * Suppress certain components on article pages
   * @param {string[]} componentNames
   */


  function suppressComponents(componentNames) {
    componentNames.forEach(function (componentName) {
      var componentEl = document.querySelector("[data-uri*=\"/".concat(componentName, "/\"]"));

      if (componentEl) {
        componentEl.remove();
      }
    });
  }
  /**
   * Retrieve article word count by finding DOM elements in the document
   * which include the `data-word-count` attribute.
   * @returns {Number}
   */


  function getArticleWordCount() {
    var sum = 0;
    document.querySelectorAll('[data-word-count]').forEach(function (el) {
      sum += Number(el.getAttribute('data-word-count') || 0, 10) || 0;
    });
    return sum;
  }
  /**
   * @param {Date} dateFirst
   * @param {Date} dateSecond
   * @returns {Number}
   */


  function differenceInMinutes(dateFirst, dateSecond) {
    function dateInMinutes(date) {
      return Math.round(date.getTime() / 1000 / 60);
    }

    var dateFirstInMinutes = dateInMinutes(dateFirst),
        dateSecondInMinutes = dateInMinutes(dateSecond);
    return dateFirstInMinutes - dateSecondInMinutes;
  }
  /**
   * Manager for the warning growls
   * @param {DocumentFragment} template
   * @param {object} settings
   * @param {number} settings.max
   * @param {string} settings.title
   * @param {string} settings.body
   * @param {string} settings.cta
   * @param {string} settings.link
   * @param {number} settings.scrollDepth
   * @param {number} settings.contentClass
   * @return {object}
   */


  function WarningGrowl(template, _ref) {
    var _ref$max = _ref.max,
        max = _ref$max === void 0 ? 1 : _ref$max,
        _ref$title = _ref.title,
        title = _ref$title === void 0 ? '' : _ref$title,
        _ref$body = _ref.body,
        body = _ref$body === void 0 ? '' : _ref$body,
        _ref$cta = _ref.cta,
        cta = _ref$cta === void 0 ? '' : _ref$cta,
        _ref$link = _ref.link,
        link = _ref$link === void 0 ? '' : _ref$link,
        _ref$scrollDepth = _ref.scrollDepth,
        scrollDepth = _ref$scrollDepth === void 0 ? 50 : _ref$scrollDepth,
        _ref$contentClass = _ref.contentClass,
        contentClass = _ref$contentClass === void 0 ? 'warning-content' : _ref$contentClass;

    function createMessage() {
      var html = "\n        <div class=\"".concat(contentClass, "\">\n          <a href=\"").concat(link, "\">\n            <div class=\"message-body\">\n              <div class=\"warning\">").concat(title, "</div>\n              <div class=\"message\">").concat(body, "</div>\n              <span class=\"cta\">").concat(cta, "<span>\n            </div>\n          </a>\n        </div>\n        "),
          content = document.createRange().createContextualFragment(html);
      return content;
    }

    var content = createMessage();
    content.querySelector('a').addEventListener('click', onClickWarn);

    function getContentCliffWarningDisplayedKey() {
      var todaysDate = new Date(),
          currentMonth = todaysDate.getMonth(),
          currentYear = todaysDate.getFullYear();
      return "content-cliff-warning-displayed-".concat(currentYear, "-").concat(currentMonth);
    }

    function contentCliffWarningDisplayed() {
      var key = getContentCliffWarningDisplayedKey();
      return getLocalStorage(key) === 'true';
    }

    function setContentCliffWarningDisplayed() {
      var key = getContentCliffWarningDisplayedKey();
      return setLocalStorage(key, 'true');
    } // trigger growl warning


    function warn() {
      generateGrowl(template, '#content-cliff-warning-growl', {
        content: content,
        onShow: function onShow() {
          onWarn();
          setContentCliffWarningDisplayed();
        },
        scrollDepth: scrollDepth
      });
    }
    /**
     * 
     * @param {number} count 
     * @returns {boolean}
     */


    function shouldWarn(count) {
      var wasWarned = contentCliffWarningDisplayed();
      return !wasWarned || count < max;
    }

    return {
      warn: warn,
      shouldWarn: shouldWarn
    };
  }

  ;
};
}, {"6":6,"7":7,"64":64,"65":65,"66":66}];
