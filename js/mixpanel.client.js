window.modules["mixpanel.client"] = [function(require,module,exports){'use strict';

var _map = require(37),
    _uniq = require(163),
    _find = require(71),
    _includes = require(33),
    _reduce = require(124),
    _set = require(87),
    _isEmpty = require(75),
    _isBoolean = require(160),
    _isNumber = require(159),
    _isNaN = require(157),
    _assign = require(57),
    _get = require(32),
    _omitBy = require(158),
    _once = require(161),
    dateService = require(162),
    visitService = require(31);

var mixpanelLib = require(156);

DS.service('mixpanelService', ['$window', '$document', function ($window, $document) {
  var componentsPath = '/components/',
      uriAttr = 'data-uri',
      layoutUriAttr = 'data-layout-uri',
      articleComponentName = 'article',
      articleComponentSelector = '[data-uri*="/components/article/"]',
      wordCountAttribute = 'data-word-count',
      sponsoredTags = ['sponsored', 'paid story'],
      // todo: this needs to be maintained; it could live in the data, but might move this server-side anyway
  retiredFactoryProps = ['Factory Layout', // we now use `Clay Layout`
  'Page Labels', // we now use `Layout Labels`
  'nyma' // we now use `NYM Client ID`
  ],
      mixpanel;
  /**
   *
   * @param {string} uri
   * @returns {string}
   */

  function uriToComponentName(uri) {
    return uri.split(componentsPath).pop().split('/').shift();
  }
  /**
   *
   * @param {Element} el
   * @returns {string}
   */


  function elementToUri(el) {
    return el.getAttribute(uriAttr) || '';
  }

  function getComponentUrisInDom() {
    return _map($document.querySelectorAll('[' + uriAttr + '*="' + componentsPath + '"]'), elementToUri);
  }
  /**
   *
   * @returns {Array}
   */


  function getComponentNamesInDom() {
    return _uniq(getComponentUrisInDom().map(uriToComponentName));
  }
  /**
   * try to get the attribute value of element found with a selector
   * @param {string} selector
   * @param {string} attribute
   * @returns {string|null}
   */


  function getSelectorAttributeValue(selector, attribute) {
    var el = $document.querySelector(selector);
    return el && el.getAttribute(attribute);
  }
  /**
   *
   * @param {string} [str]
   * @returns {Array}
   */


  function commaStringToArray(str) {
    return str ? str.split(',').map(function (item) {
      return item.trim();
    }) : [];
  }
  /**
   *
   * @returns {string|null}
   */


  function getLayoutUri() {
    return getSelectorAttributeValue('[' + layoutUriAttr + ']', layoutUriAttr);
  }
  /**
   * **assumes that all tags are written to meta keywords**
   * @returns {Array}
   */


  function getPageTags() {
    return commaStringToArray(getSelectorAttributeValue('meta[property="article:tag"]', 'content'));
  }
  /**
   * **assumes that authors are written to meta author**
   * @returns {Array}
   */


  function getAuthors() {
    return commaStringToArray(getSelectorAttributeValue('meta[name="author"]', 'content'));
  }
  /**
   * determines if it is a sponsored article based on tags
   * @param {Array} tags
   * @returns {boolean}
   */


  function isPaidContent(tags) {
    return !!_find(tags, function (tag) {
      return _includes(sponsoredTags, tag);
    });
  }
  /**
   * Sums all of the word-counts within the article
   * ** assumes all components containing text have a `data-word-count` attribute **
   * @param {Element} article
   * @returns {Number}
   */


  function getWordCount(article) {
    return _reduce(article.querySelectorAll('[' + wordCountAttribute + ']'), function (sum, el) {
      return sum + parseInt(el.getAttribute(wordCountAttribute) || 0, 10) || 0;
    }, 0);
  }
  /**
   * Set super property (overwrites existing value)
   * @param {string} property
   * @param {*} val
   */


  function setSuper(property, val) {
    mixpanel.register(_set({}, property, val));
  }
  /**
   * Increment super property
   * @param {string} property
   * @param {number} [amount] defaults to 1
   */


  function incrementSuper(property, amount) {
    setSuper(property, (mixpanel.get_property(property) || 0) + (amount || 1));
  }
  /**
   * Increment super property always, and increment people property only if logged in.
   * @param {string} property
   * @param {boolean} isLoggedIn  we are only updating the people data if the person is logged in
   * @param {number} [amount]
   */


  function incrementSuperAndPeople(property, isLoggedIn, amount) {
    incrementSuper(property, amount);

    if (isLoggedIn) {
      mixpanel.people.increment(property, amount);
    }
  }
  /**
   *
   * @returns {string}
   */


  function getOgTitle() {
    var el = $document.querySelector('meta[property="og:title"]');
    return el ? el.content : $document.title; // try the open graph title; otherwise document title
  }
  /**
   * check if the document is visible
   * @returns {boolean}
   */


  function documentIsVisible() {
    return $document.visibilityState === 'visible';
  }
  /**
   * Wait until the document is visible to track the page view
   * this prevents "prerender" from counting as a page view
   * @param {Function} fn
   */


  function onceDocumentIsVisible(fn) {
    var triggered;

    if (documentIsVisible()) {
      // run immediately if possible
      fn();
    } else {
      $document.addEventListener('visibilitychange', function () {
        // or listen for the state to change
        if (!triggered && documentIsVisible()) {
          triggered = true; // ensures only run once

          fn();
        }
      });
    }
  }
  /**
   * Record `Page Viewed` and `Visit` events once document is visible
   * @param {object} settings
   */


  function trackPageView(settings) {
    onceDocumentIsVisible(function () {
      var viewsInVisitProperty = 'Page Views in Visit',
          // using GA's scope term of "hit-level" to mean data only sent with this event
      hitLevelProps = {
        'Clay Components': settings.componentsOnPage // we are only interested in this for page view/visit events

      },
          hasArticleComponent = _includes(settings.componentsOnPage, articleComponentName); // adding all properties that are new to clay as hit-level props
      // if they were super-props, then we would need to update all existing pages outside of clay to remove them.
      // todo: we may want to make these super-props again in the future if we want them reported with other events


      setIfRecordable(hitLevelProps, 'Clay Page', settings.pageUri); // new in clay

      setIfRecordable(hitLevelProps, 'Clay Layout', settings.layoutUri); // new in clay

      setIfRecordable(hitLevelProps, 'Layout Labels', settings.layoutLabels); // new in clay

      setIfRecordable(hitLevelProps, 'Content Channel', settings.contentChannel); // new in clay

      setIfRecordable(hitLevelProps, 'Feature Types', settings.featureTypes); // new in clay

      setIfRecordable(hitLevelProps, 'Publish Date', settings.publishDateISOString); // new in clay

      incrementSuperAndPeople('Total Page Views', settings.isLoggedIn);

      if (hasArticleComponent) {
        incrementSuperAndPeople('Total Article Views', settings.isLoggedIn);
      }

      if (settings.isNewVisit) {
        incrementSuperAndPeople('Total Visits', settings.isLoggedIn);
        setSuper(viewsInVisitProperty, 1); // reset to 1 on new visit

        mixpanel.track('Visit', hitLevelProps); // Warning: order matters, mixpanel.track must come after all properties have been set.
      } else {
        incrementSuper(viewsInVisitProperty);
      }

      mixpanel.track('Page Viewed', hitLevelProps); // All `Page Viewed` event props are super props
    });
  }
  /**
   * calculate number of days between now and the date client side
   * could do this through Custom Queries on the reporting side, but is not built into the default mixpanel reporting UI.
   * https://mixpanel.com/help/reference/custom-query/api-reference
   * todo: consider doing this on the reporting side.
   * @param {number} startTimestamp
   * @param {number} endTimestamp
   * @returns {number}
   */


  function getDaysElapsed(startTimestamp, endTimestamp) {
    return Math.floor((endTimestamp - startTimestamp) / (24 * 60 * 60 * 1000));
  }
  /**
   * Updates object **in place**
   * If the property was already set to `true`, it will not be overwritten.
   * @param {string} propertyName
   * @param {boolean} isTrue
   * @param {object} propsToSet
   * @param {object} propsToSetIfNotSet
   */


  function onceTrueAlwaysTrue(propertyName, isTrue, propsToSet, propsToSetIfNotSet) {
    if (isTrue) {
      propsToSet[propertyName] = true;
    } else {
      propsToSetIfNotSet[propertyName] = false;
    }
  }
  /**
   * These are values that should send to mixpanel
   * excludes: null, undefined, NaN, ''
   * includes: strings with length, numbers (not NaN), booleans, arrays, and objects
   * @param {*} value
   * @returns {boolean}
   */


  function isRecordable(value) {
    return !_isEmpty(value) || _isBoolean(value) || _isNumber(value) && !_isNaN(value);
  }
  /**
   * add value to object only if the value is not empty
   * @param {object} obj
   * @param {string} key
   * @param {*} value
   * @returns {boolean}
   */


  function setIfRecordable(obj, key, value) {
    if (isRecordable(value)) {
      obj[key] = value;
      return true;
    }

    return false;
  }
  /**
   * Used for values that changes from page to page and are stored in super-properties
   * Updates object **in place**
   * Sets value to object or Removes super property if value is empty
   * @param {object} obj
   * @param {string} key
   * @param {*} value
   */


  function registerIfRecordable(obj, key, value) {
    setIfRecordable(obj, key, value) || mixpanel.unregister(key);
  }
  /**
   * Set people properties
   * Only the current value of people properties is available in reports
   * @param {object} settings
   * @param {string} settings.nymaClientId
   * @param {string} settings.firstVisitISOString
   * @param {boolean} settings.isLoggedIn
   */


  function setPeopleProperties(settings) {
    var propsToSet = {},
        // can overwrite previous property values
    propsToSetIfNotSet = {}; // only set these properties if they have not yet been set

    propsToSetIfNotSet['First Visit Date'] = settings.firstVisitISOString;
    onceTrueAlwaysTrue('Registered User', settings.isLoggedIn, propsToSet, propsToSetIfNotSet);
    mixpanel.identify(settings.nymaClientId); // order matters: need to identify prior to setting people properties.

    mixpanel.people.set(propsToSet);
    mixpanel.people.set_once(propsToSetIfNotSet);
  }
  /**
   * accounts for cookie timestamp:
   * if firstVisitTimestamp is more than a day old, returns false
   * @param {object} visitState
   * @param {number} visitState.visitCount
   * @param {number} visitState.firstVisitTimestamp
   * @param {Date} now
   * @returns {boolean}
   */


  function isFirstTimeUser(visitState, now) {
    return visitState.visitCount === 1 && visitState.firstVisitTimestamp > now.getTime() - 1000 * 60 * 60 * 24;
  }
  /**
   * Set "super properties" which are properties added to all events
   * The value at the time of the event is available in reports
   * Stored in a browser cookie or LS, and will persist between visits
   * @param {object} settings
   */


  function setSuperProperties(settings) {
    var propsToSet = {}; // can overwrite previous property values
    // remove retired super-props that are still set in the-factory
    // these will persist if not unset

    retiredFactoryProps.forEach(function (key) {
      mixpanel.unregister(key);
    });
    propsToSet.debug = true; // todo: someday we will turn this off :)

    propsToSet.Domain = settings.hostname;
    propsToSet.Site = settings.site;
    propsToSet.Day = settings.dayOfWeek;
    propsToSet.Hour = settings.hour;
    propsToSet['NYM Client Id'] = settings.clientId; // this will allow us to tie data to our internal tracking, previously `nyma`

    propsToSet['First Visit Date'] = settings.firstVisitISOString;
    propsToSet['Registered User'] = settings.isLoggedIn;
    propsToSet['Is New Visit'] = settings.isNewVisit; // page-specific properties: un-register with each page load as we do not want them to persist between pages

    registerIfRecordable(propsToSet, 'Days Since First Visit', settings.daysSinceFirstVisit);
    registerIfRecordable(propsToSet, 'First Time User', settings.isFirstTimeUser);
    registerIfRecordable(propsToSet, 'Title', settings.title);
    registerIfRecordable(propsToSet, 'Paid Content', settings.isPaidContent);
    registerIfRecordable(propsToSet, 'Tags', settings.tags); // meta keywords

    registerIfRecordable(propsToSet, 'Authors', settings.authors); // meta keywords

    registerIfRecordable(propsToSet, 'Word Count', settings.wordCount);
    mixpanel.register(propsToSet);
  }
  /**
   * Gather timestamps and set people and super properties
   * @param {object} settings
   */


  function setProperties(settings) {
    setSuperProperties(settings);

    if (settings.isLoggedIn) {
      // only set people properties if logged-in, so that we do not exceed profiles limit, $$$
      setPeopleProperties(settings);
    }
  }
  /**
   * add to settings using client-side logic
   *
   * @param {object}  componentSettings
   * @param {string}  componentSettings.site
   * @param {Array}   componentSettings.layoutLabels
   *
   * @param {object}  visitState
   * @param {string}  visitState.clientId `nyma` cookie, which is a combination of fingerprint and timestamp
   * @param {number}  visitState.visitCount
   * @param {number}  visitState.firstVisitTimestamp
   * @param {boolean} visitState.isNewVisit
   * @param {boolean} visitState.isLoggedIn
   * @param {string}  visitState.pageUri
   * @param {number}  visitState.timestamp
   *
   * @returns {object}
   */


  function addClientSideSettings(componentSettings, visitState) {
    var clientSideSettings = {
      hostname: $window.location.hostname,
      layoutUri: getLayoutUri(),
      componentsOnPage: getComponentNamesInDom(),
      now: new Date(visitState.timestamp)
    },
        // settings below here could be set server-side if we handle tracking server-side
    visitDerivedSettings = {
      firstVisitISOString: new Date(visitState.firstVisitTimestamp).toISOString(),
      isFirstTimeUser: isFirstTimeUser(visitState, clientSideSettings.now),
      // accounts for nym cookie
      dayOfWeek: dateService.getDayOfWeek(clientSideSettings.now),
      // Sunday-Saturday
      hour: clientSideSettings.now.getHours(),
      // 0-23
      daysSinceFirstVisit: getDaysElapsed(visitState.firstVisitTimestamp, visitState.timestamp)
    },
        article = document.querySelector(articleComponentSelector),
        articleTime = article && article.querySelector('time'),
        articleSettings = {
      title: getOgTitle(),
      authors: getAuthors(),
      tags: getPageTags(),
      wordCount: article && getWordCount(article),
      contentChannel: article && article.getAttribute('data-content-channel'),
      featureTypes: commaStringToArray(article && article.getAttribute('data-type')),
      publishDate: articleTime && articleTime.getAttribute('datetime')
    },
        articleDerivedSettings = {
      isPaidContent: isPaidContent(articleSettings.tags),
      publishDateISOString: articleSettings.publishDate && new Date(articleSettings.publishDate).toISOString()
    };
    return _assign(clientSideSettings, componentSettings, // contains `site` and `layoutLabels` because the component instance is specific to the layout
    visitState, // contains state as supplied by the `visit` service
    visitDerivedSettings, articleSettings, articleDerivedSettings);
  }
  /**
   * we need to make sure that the mixpanel distinct_id is the nym cient id
   * warning: this could break if mixpanel drastically changes their client js internals
   * @param {string} clientId
   * @param {boolean} isFirstTimeUser
   */


  function ensureMixpanelUniqueIdIsNymClientId(clientId, isFirstTimeUser) {
    var existingProps = _get(mixpanel, 'cookie.props', {}),
        exisitingDistinctId = existingProps.distinct_id;

    if (exisitingDistinctId !== clientId) {
      existingProps = _omitBy(existingProps, function (val, key) {
        // removes mixpanel people property queues and id
        return key.substr(0, 2) === '__' || key === 'distinct_id';
      });
      mixpanel.reset();
      mixpanel.register(existingProps);
      mixpanel.identify(clientId);

      if (!isFirstTimeUser) {
        // preserve history of returning visitors
        mixpanel.alias(clientId, exisitingDistinctId);
      }
    }
  }
  /**
   * init by setting properties and tracking page view event
   * @param {object} componentSettings
   */


  function init(componentSettings) {
    var hostname = $window.location.hostname || '',
        isLikelyProd = hostname.indexOf('qa.') + hostname.indexOf('beta.') + hostname.indexOf('localhost') + hostname.indexOf('.aws.') === -1 * 4;
    mixpanel = mixpanelLib.init(isLikelyProd ? '63940ee7ac2873acfad69127f6d3ec74' : // NYMag
    '4dbb5bc69945223d6ddeec6da5d3b871', // NYM Dev
    {
      upgrade: true,
      // converts old cookies into localStorage
      persistence: 'localStorage' // setting to make it use localStorage because this does not work: `mixpanel.set_config({ persistence: 'localStorage' });`

    });
    visitService.onceReady(function (visitState) {
      var settings = addClientSideSettings(componentSettings, visitState);
      ensureMixpanelUniqueIdIsNymClientId(settings.clientId, settings.isFirstTimeUser);
      setProperties(settings);
      trackPageView(settings);
    });
  }
  /**
   * only initialize once
   */


  this.initOnce = _once(init);
}]);
DS.controller('mixpanel', ['mixpanelService', function (mixpanelService) {
  return function (componentEl) {
    // settings from the component element
    var componentSettings = {
      site: componentEl.getAttribute('data-site'),
      layoutLabels: (componentEl.getAttribute('data-layout-labels') || '').split(',')
    };
    mixpanelService.initOnce(componentSettings);
  };
}]);
}, {"31":31,"32":32,"33":33,"37":37,"57":57,"71":71,"75":75,"87":87,"124":124,"156":156,"157":157,"158":158,"159":159,"160":160,"161":161,"162":162,"163":163}];
