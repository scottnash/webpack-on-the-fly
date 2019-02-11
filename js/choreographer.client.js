window.modules["choreographer.client"] = [function(require,module,exports){/* eslint complexity: ["error", 11] */

/**
 * The recent history of a client's activity across all sites
 * @typedef {object} ActiveTouts
 * @param {object} [toutType] - hash of a tout type (key)
 * and an object containing user input used to populated template vars
 */
'use strict';

var cookie = require(28),
    _require = require(67),
    insertSpeedBumpComponents = _require.insertSpeedBumpComponents,
    _require2 = require(64),
    generateGrowl = _require2.generateGrowl,
    gtm = require(41),
    _require3 = require(65),
    getLocalStorage = _require3.getLocalStorage,
    _require4 = require(68),
    getClientHistory = _require4.getClientHistory,
    updateClientHistoryWithPageData = _require4.updateClientHistoryWithPageData,
    auth0 = require(7),
    _require5 = require(63),
    Scenario = _require5.Scenario,
    cidReadyEvent = 'nymcid-set',
    cidKey = 'nymcid',
    logger = require(66).Logger(function () {
  return getLocalStorage('show_choreographer_logs');
});

module.exports = function (el) {
  auth0.on('init', function () {
    initializeChoreographer(el);
  });
};
/**
 * Choreographer initializer
 * @param {Element} el
 * @return {Promise}
 */


function initializeChoreographer(el) {
  var siteSlug = el.getAttribute('data-site-slug'),
      pageCountsAsView = pageShouldCountAsView(),
      isSubscriber = auth0.isSubscriber();

  if (!siteSlug) {
    return console.error('siteSlug not found.');
  } // cid is set by gtm.
  // it will not work internally so so set `nymid` on the cookie manually


  return getClientId(cidKey, 8000) // post this visit activity to the tracker and get statistics
  // on other recent visits.
  .then(function (clientId) {
    logger.h1('Choreographer initialized');
    logger.log("clientId: ".concat(clientId));
    logger.log("page counts as a view: ".concat(pageCountsAsView));
    return pageCountsAsView ? updateClientHistoryWithPageData(clientId, siteSlug) : getClientHistory(clientId);
  }).then(function (history) {
    logger.group();
    logger.h2('Client history');
    logger.table(history);
    logger.groupEnd(); // if user is from ncr, do not show touts

    if (isNCR()) {
      return;
    } // read json into scenarios and touts info


    var _readJSONFromScript = readJSONFromScript(el.querySelector('script')),
        scenarios = _readJSONFromScript.scenarios,
        touts = _readJSONFromScript.touts,
        activeTouts = scenarios.map(function (scenarioInput) {
      return Scenario(scenarioInput, history, siteSlug, isSubscriber);
    }).filter(function (scenario) {
      logger.group();
      logger.h2('Evaluating scenarios');
      logger.log(scenario);
      logger.groupEnd();
      return scenario.shouldShow;
    }).reduce(function (acc, _ref) {
      var action = _ref.action,
          min = _ref.min,
          count = _ref.count;
      var tout = touts.find(function (_ref2) {
        var value = _ref2.value;
        return value === action;
      }); // if the accumulator already has a tout assigned, exit early

      if (!tout || acc[tout.type]) {
        return acc;
      }

      acc[tout.type] = tout;
      acc[tout.type].viewCount = count - min;
      return acc;
    }, {});

    logger.group();
    logger.h2('Active Touts');
    logger.log(activeTouts);
    logger.groupEnd();
    executeTouts(el, pageCountsAsView, activeTouts, history);
  }).catch(console.error);
}

;
/**
 * Determine if the current `document` contains a component
 * via searching by `data-uri` attribute values.
 * @param {string} componentName
 * @returns {Boolean}
 */

function documentIncludesComponent(componentName) {
  return document.querySelector("[data-uri*=\"/".concat(componentName, "/\"]"));
}
/**
 * Determine if the current page should be counted as a
 * page view in our remote service.
 * @returns{Boolean}
 */


function pageShouldCountAsView() {
  return !documentIncludesComponent('product');
}
/**
 * Execute activeTouts by tout type
 * @param {Element} el - contains all the tout templates
 * @param {Boolean} pageCountsAsView
 * @param {ActiveTouts} touts
 * @param {ClientHistory} history - full client history
 */


function executeTouts(el, pageCountsAsView) {
  var touts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var history = arguments.length > 3 ? arguments[3] : undefined;
  var global = history.global,
      globalViewHistory = {
    totalArticleCount: global.total || 0,
    standardArticleCount: global.Article || 0,
    featureArticleCount: global.Feature || 0,
    magazineArticleCount: global.Magazine || 0
  }; // -- Content cliff

  if (pageCountsAsView && touts['content-cliff']) {
    cliff(findTemplate(el, 'content-cliff'), touts['content-cliff'], touts['content-cliff'].viewsLeft, history);
    return;
  } // --- Promo Growl


  if (!touts['growl-newletter'] && touts['promo-growl']) {
    promoGrowl(findTemplate(el, 'growl-message'), {
      contentClass: 'promo-content',
      title: undefined,
      name: touts['promo-growl'].name,
      scrollDepth: touts['promo-growl'].promoGrowlScrollDepth,
      cta: touts['promo-growl'].promoGrowlCTA,
      body: touts['promo-growl'].promoGrowlMessage,
      link: touts['promo-growl'].promoGrowlLink,
      baseTrackingData: globalViewHistory
    });
    return;
  } // -- Speed Bump


  if (touts['speed-bump']) {
    insertSpeedBumpComponents(findTemplate(el, 'speed-bump'), touts['speed-bump'], globalViewHistory);
  }
}

function promoGrowl(frag, _ref3) {
  var contentClass = _ref3.contentClass,
      scrollDepth = _ref3.scrollDepth,
      name = _ref3.name,
      title = _ref3.title,
      body = _ref3.body,
      cta = _ref3.cta,
      link = _ref3.link,
      baseTrackingData = _ref3.baseTrackingData;

  function createMessage() {
    var html = "\n      <div class=\"".concat(contentClass, "\">\n        <a href=\"").concat(link, "\">\n          <div class=\"message-body\">\n            <div class=\"warning\">").concat(title, "</div>\n            <div class=\"message\">").concat(body, "</div>\n            <span class=\"cta\">").concat(cta, "<span>\n          </div>\n        </a>\n      </div>\n      "),
        content = document.createRange().createContextualFragment(html);
    return content;
  }

  var content = createMessage();
  content.querySelector('a').addEventListener('click', function () {
    var data = baseTrackingData;
    data.event = 'eec.promotionClick';
    data.ecommerce = {
      promoClick: {
        promotions: [{
          name: name,
          creative: body,
          id: 'promo growl',
          position: 'growl'
        }]
      }
    };
    gtm.reportNow(data);
  });
  generateGrowl(frag, '#growl-message', {
    content: content,
    scrollDepth: scrollDepth,
    onShow: function onShow() {
      var data = baseTrackingData;
      data.event = 'eec.promotionView';
      data.ecommerce = {
        promoView: {
          promotions: [{
            name: name,
            creative: body,
            id: 'promo growl',
            position: 'growl'
          }]
        }
      };
      gtm.reportNow(data);
    }
  });
}
/**
 * Enter the content cliff flow
 * Either show a warning or create content cliff on the page
 * 
 * @param {DocumentFragment} cliffTemplate
 * @param {object} cliffOptions
 * @param {string} cliffOptions.contentCliffWarningTitle
 * @param {string} cliffOptions.contentCliffWarningBody
 * @param {string} cliffOptions.contentCliffBody
 * @param {string} cliffOptions.contentCliffIntro
 * @param {string} cliffOptions.contentCliffCTA
 * @param {string} cliffOptions.contentCliffURL
 * @param {number} viewsLeft
 * @param {ClientHistory} history
 * @returns {undefined}
 */


function cliff(cliffTemplate, cliffOptions, viewsLeft, history) {
  var first_visit = history.first_visit,
      global = history.global,
      baseTrackingData = {
    totalArticleCount: global.total || 0,
    standardArticleCount: global.Article || 0,
    featureArticleCount: global.Feature || 0,
    magazineArticleCount: global.Magazine || 0
  },
      name = cliffOptions.name,
      contentCliffWarningBody = cliffOptions.contentCliffWarningBody,
      contentCliffBody = cliffOptions.contentCliffBody,
      element = document.importNode(cliffTemplate, true),
      cliffElement = element.querySelector('.content-cliff'),
      anchor = document.querySelector('.article-content > .clay-paragraph');

  if (!cliffElement) {
    return;
  }

  anchor.insertAdjacentHTML('afterend', cliffElement.outerHTML);

  require("content-cliff.client")(document.querySelector('.content-cliff'), {
    cliffOptions: cliffOptions,
    viewsLeft: viewsLeft,
    firstVisit: Number(first_visit),
    onWarn: function onWarn() {
      var data = baseTrackingData;
      data.event = 'eec.promotionView';
      data.ecommerce = {
        promoView: {
          promotions: [{
            name: name,
            creative: contentCliffWarningBody,
            id: 'warning growl',
            position: 'growl'
          }]
        }
      };
      gtm.reportNow(data);
    },
    onClickWarn: function onClickWarn() {
      var data = baseTrackingData;
      data.event = 'eec.promotionClick';
      data.ecommerce = {
        promoClick: {
          promotions: [{
            name: name,
            creative: contentCliffWarningBody,
            id: 'warning growl',
            position: 'growl'
          }]
        }
      };
      gtm.reportNow(data);
    },
    onShow: function onShow() {
      var data = baseTrackingData;
      data.event = 'eec.promotionView';
      data.ecommerce = {
        promoView: {
          promotions: [{
            name: name,
            creative: contentCliffBody,
            id: 'content cliff',
            position: 'in-article'
          }]
        }
      };
      gtm.reportNow(data);
    },
    onClickCliff: function onClickCliff() {
      var data = baseTrackingData;
      data.event = 'eec.promotionClick';
      data.ecommerce = {
        promoClick: {
          promotions: [{
            name: name,
            creative: contentCliffBody,
            id: 'content cliff',
            position: 'in-article'
          }]
        }
      };
      gtm.reportNow(data);
    }
  });
}
/**
 * Get the client id assigned by gtm
 * If not found on cookie, listens for event indicating it is set
 * Times out after specified timeout
 * @param {string} key - key on cookie for cid
 * @param {number} timeoutLength
 * @listens event:nymcid-set - fires when this has been set on cookie
 * @returns {Promise<String>}
 */


function getClientId() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var timeoutLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8000;
  var value = cookie.get(key);

  if (value) {
    return Promise.resolve(value);
  }

  return new Promise(function (resolve, reject) {
    var to = setTimeout(function () {
      reject("could not find key: ".concat(key, " on cookie after ").concat(timeoutLength, "ms"));
    }, timeoutLength);
    window.addEventListener(cidReadyEvent, function () {
      clearTimeout(to);
      resolve(cookie.get(key));
    });
  });
}
/**
 * Read scenarios from coregrapher data
 * Returns an array of conditions with logic
 * @param {Element} el
 * @return {object.array} touts
 * @return {object.array} scenarios
 */


function readJSONFromScript(el) {
  try {
    return JSON.parse(el.innerHTML);
  } catch (e) {
    return {
      touts: [],
      scenarios: []
    };
  }
}
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
/**
 * Check if user is from NCR for exclusion
 * @returns {boolean}
 */


function isNCR() {
  return /[?&]source=ncr/.test(location.search);
}
}, {"7":7,"28":28,"41":41,"63":63,"64":64,"65":65,"66":66,"67":67,"68":68,"content-cliff.client":"content-cliff.client"}];
