window.modules["ad.client"] = [function(require,module,exports){// Allow this to pass eslint complexity rule

/* eslint complexity: ["error", 18] */
'use strict';

var _forEach = require(27),
    _max = require(29),
    $visibility = require(26); // return any flagged components on page


var flaggedComponentsOnPage = function () {
  var flaggedComponentSelectors = ['.article-sidebar[data-width="large"]'],
      articleContent = document.querySelector('.article-content'),
      flaggedComponents = [],
      componentsFound;

  if (articleContent) {
    _forEach(flaggedComponentSelectors, function (selector) {
      componentsFound = articleContent.querySelectorAll(selector);

      _forEach(componentsFound, function (component) {
        flaggedComponents.push(component);
      });
    });
  }

  return flaggedComponents;
}(); // calculate vertical overlap between two elements


function getElementsVerticalOverlap(el1, el2) {
  var rect1 = el1.getBoundingClientRect(),
      rect2 = el2.getBoundingClientRect(),
      elementsAreOverlapping = !(rect1.top > rect2.bottom || rect1.right < rect2.left || rect1.bottom < rect2.top || rect1.left > rect2.right);
  return elementsAreOverlapping ? rect2.bottom - rect1.top : 0;
} // calculate vertical overlap between a reference element (el)
// and an array of other elements


function getElementsOverlapAmount(el, referenceAgainstEls) {
  var verticalElementOverlapAmounts = [],
      verticalElementOverlap;

  _forEach(referenceAgainstEls, function (refEl) {
    verticalElementOverlap = getElementsVerticalOverlap(el, refEl);
    verticalElementOverlapAmounts.push(verticalElementOverlap);
  });

  return _max(verticalElementOverlapAmounts);
}

function getCutAdChannel(contentChannel) {
  var contentChannelToAdChannel = {
    all: '',
    animals: 'Self/SoU',
    beauty: 'Style/Beauty',
    'career money productivity': 'Power/Money',
    celebrity: 'Culture/Celebrity',
    'crime-assault': 'Power',
    'culture-media': 'Culture',
    fashion: 'Style/Fashion',
    'feminism-politics-identity': 'Power/Politics',
    'relationships-friends family': 'Self',
    'health-wellness': 'Self/Health',
    'home design': 'Style/Design_Hunting',
    'learning creativity': 'Self/SoU',
    living: 'Style',
    other: '',
    parenting: 'Self/Motherhood',
    'mental health personality social behavior': 'Self',
    'relationships-sex dating marriage': 'Self/sex_relationships',
    shopping: 'Style/Shopping',
    weddings: 'Style/Weddings'
  };
  return contentChannelToAdChannel[contentChannel] || '';
}

function getVultureAdChannel(contentChannel) {
  var adChannel = '';

  switch (contentChannel) {
    case 'tv': // Leave 'tv' as is

    case 'music': // Leave 'music' as is

    case 'movies': // Leave 'movies' as is

    case 'books': // Leave 'books' as is

    case 'comedy': // Leave 'comedy' as is

    case 'art': // Leave 'art' as is

    case 'theater':
      // Leave 'theater' as is
      adChannel = contentChannel;
      break;

    default:
      // remaining content channels shouldn't have an ad channel
      adChannel = '';
  }

  return adChannel;
}

function getIntelligencerAdChannel(contentChannel) {
  var adChannel = '';

  switch (contentChannel) {
    case 'politics-domestic':
    case 'politics-international':
      adChannel = 'Politics';
      break;

    case 'business':
    case 'internet-culture':
    case 'products-apps-software':
    case 'products-consumer-electronics':
      adChannel = 'Business';
      break;

    case 'tech-industry':
    case 'tech-society':
      adChannel = 'Technology';
      break;

    default:
      // remaining content channels shouldn't have an ad channel
      adChannel = '';
  }

  return adChannel;
}
/**
 * Append the correct adzone to the base domain.
 * @param  {string} contentChannel
 * @returns {string}
 */


function getNYMagAdChannel(contentChannel) {
  var adChannel = '';

  switch (contentChannel) {
    case 'all':
      adChannel = contentChannel;
      break;

    case 'company information':
      adChannel = 'company';
      break;

    case 'new york guides & things to do':
      adChannel = 'to-do';
      break;

    case 'other':
      adChannel = contentChannel;
      break;

    case 'sponsored guides':
      adChannel = 's-guides';
      break;

    default:
      // remaining content channels shouldn't have an ad channel
      adChannel = '';
  }

  return adChannel;
} // Append section to ad zone string for The Cut and Vulture.
// This is a Custom Business Solution. Don't carry into any generic DFP Component.


function appendSectionToDfpAds() {
  // Setup vars and initial DOM lookups
  var ogSiteElement = document.querySelector("meta[property='og:site_name']"),
      contentChannelElement = document.querySelector('article[data-content-channel]'),
      dfpAds = document.querySelectorAll('[data-name^="/4088/"]'),
      ogSite,
      contentChannel,
      adChannel; // Check that matches were found and then gather data

  if (ogSiteElement) {
    ogSite = ogSiteElement.content;
  }

  if (contentChannelElement) {
    contentChannel = contentChannelElement.getAttribute('data-content-channel').toLowerCase();
  }

  if (contentChannel) {
    if (ogSite === 'The Cut') {
      adChannel = getCutAdChannel(contentChannel);
    } else if (ogSite === 'Vulture') {
      adChannel = getVultureAdChannel(contentChannel);
    } else if (ogSite === 'Intelligencer') {
      adChannel = getIntelligencerAdChannel(contentChannel);
    } else if (ogSite === 'New York Magazine') {
      adChannel = getNYMagAdChannel(contentChannel);
    }

    if (adChannel) {
      // Alter the ad string with the section name
      _forEach(dfpAds, function (ad) {
        ad.setAttribute('data-name', ad.getAttribute('data-name') + '/' + adChannel);
      });
    }
  }
} // Injects google's ad code before the closing body tag


function injectGoogleScripts() {
  var googleTagAds = document.createElement('script'),
      googleAdWords = document.createElement('script'),
      frag = document.createDocumentFragment();
  googleTagAds.src = '//www.googletagservices.com/tag/js/gpt.js';
  googleTagAds.async = 'async';
  googleAdWords.src = '//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  googleAdWords.async = 'async';
  frag.appendChild(googleTagAds);
  frag.appendChild(googleAdWords);
  document.getElementsByTagName('body')[0].appendChild(frag);
}

appendSectionToDfpAds();
injectGoogleScripts();
DS.controller('ad', ['adService', function (adService) {
  var Ad = function Ad(el) {
    var adData = adService.create(el),
        offloadAd = el.getAttribute('data-offload'),
        visible = new $visibility.Visible(el, {
      preloadThreshold: offloadAd ? window.innerHeight / 2 : 200
    }),
        preloadAdHidden = false,
        overlapAmount,
        dataGap,
        verticalOffset;

    function repositionAd() {
      // reposition ad if at risk of an overlapping element (i.e. large article-sidebar)
      if (window.innerWidth >= 1180 && el.parentElement.classList.contains('ad-repeat') && flaggedComponentsOnPage.length) {
        overlapAmount = getElementsOverlapAmount(el, flaggedComponentsOnPage);
        dataGap = parseInt(el.parentElement.getAttribute('data-gap'), 10);
        verticalOffset = 30;
        el.style.marginTop = dataGap + verticalOffset + overlapAmount + 'px';
      }
    }

    function onShown() {
      repositionAd();
      adService.refresh(adData);
    }

    function onHidden() {
      adService.remove(adData); // we don't want to add the shown listener until the ad has been hidden
      // (preload takes care of showing ads below the fold the first time they're shown)
      // so only add the listener on the first time the ad is hidden

      if (!preloadAdHidden) {
        preloadAdHidden = true;
        visible.on('shown', onShown);
      }
    }

    function onPreload() {
      if (!adData.slot && $visibility.isElementNotHidden(el)) {
        repositionAd(); // if an ad hasn't been seen yet, tell googletags to slot it

        adService.load(adData);
      }
    } // load ads immediately if they're above the fold, else lazy load


    if (visible.preload && $visibility.isElementNotHidden(el)) {
      // batch initial ad calls together and apply sorting logic
      adService.addToPageLoadQueue(adData);

      if (offloadAd) {
        visible.on('hidden', onHidden);
      }
    } else {
      visible.on('preload', onPreload);

      if (offloadAd) {
        visible.on('hidden', onHidden);
      }
    }

    this.adData = adData;
  };

  return Ad;
}]);
}, {"26":26,"27":27,"29":29}];
