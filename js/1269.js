window.modules["1269"] = [function(require,module,exports){// Allow this to pass eslint complexity rule

/* eslint complexity: ["error", 11] */
'use strict';

var _forEach = require(27),
    _range = require(907),
    clayUtils = require(56),
    utils = require(43),
    stripTags = require(42),
    videoComponents = ['ooyala-player', 'video', 'html-video', 'cspan-video', 'embedly', 'youtube'],
    blacklistedBeforeAd = ['product-list', 'related-stories', 'pull-quote', 'sponsored-pull-quote', 'column-subscribe', 'clay-subheader', 'divider', 'blockquote'].concat(videoComponents),
    blacklistedAfterAd = ['product-list', 'related-stories', 'pull-quote', 'sponsored-pull-quote', 'column-subscribe'].concat(videoComponents),
    blacklistedPairs = [{
  itemOne: 'clay-subheader',
  itemTwo: 'mediaplay-image'
}, {
  itemOne: 'clay-subheader',
  itemTwo: 'image'
}, {
  itemOne: 'clay-subheader',
  itemTwo: 'image-collection'
}],
    nonIncrementingComponents = ['divider', 'divider-short', 'related'],
    paragraphWordCountMin = 25,
    // These variables are used to change the ad insertion logic based on the length of the article.
// Shorter articles require a more aggressive ad insertion approach,
// changing the number of components between ads,
// as well as how close to the bottom of the article an ad can appear
shortArticleComponentCountMin = 2,
    longArticleMobileComponentCountMin = 3,
    longArticleTabletComponentCountMin = 4,
    shortArticleEndOfArticleCriteria = 1,
    longArticleEndOfArticleCriteria = 2;
/**
 * Runs checks on the component to see if it clears blacklists,
 * and if there have been enough words or components since
 * the last ad of a particular type.
 * @param {index} index - The index of the component within the article content.
 * @param {content} content - The array of article content.
 * @param {component} component - The component being passed in.
 * @param {adInfo} adInfo - The object containing information about the ad that is being passed in.
 * @returns {boolean}
 */


function runChecks(index, content, component, adInfo) {
  return clearsBlacklists(index, content, component, adInfo) && counterChecksPass(adInfo);
}
/**
 * If a component appears on the `blacklistedBeforeAd` list,
 * or is followed by a component on the `blacklistedAfterAd` list,
 * or is followed by its match on the `blacklistedPairs` list,
 * an ad should not appear. If the ad has a `videoBuffer`, all components
 * within the buffer range should be checked, and, if any is a video, the ad should not appear.
 * @param {index} index - The index of the component within the article content.
 * @param {content} content - The array of article content.
 * @param {component} component - The component being passed in.
 * @param {adInfo} adInfo - The object containing information about the ad that is being passed in.
 * @returns {boolean}
 */


function clearsBlacklists(index, content, component, adInfo) {
  // if the component does not allow an ad to come after, it will not clear the blacklist
  if (!!componentNameInList(component, blacklistedBeforeAd)) {
    return false;
  } // if the next component does not allow an ad to come before it, it will not clear the blacklist


  if (!!componentNameInList(content[index + 1], blacklistedAfterAd)) {
    return false;
  } // if the current component matches one of the items in one of the blacklisted pairs arrays,
  // check the next component


  for (var i = 0; i < blacklistedPairs.length; i++) {
    if (clayUtils.getComponentName(content[index]._ref) === blacklistedPairs[i].itemOne && clayUtils.getComponentName(content[index + 1]._ref) === blacklistedPairs[i].itemTwo) {
      return false;
    }

    if (clayUtils.getComponentName(content[index]._ref) === blacklistedPairs[i].itemTwo && clayUtils.getComponentName(content[index + 1]._ref) === blacklistedPairs[i].itemOne) {
      return false;
    }
  } // If ad type has a video buffer defined, get buffer component range array and check for a video


  if (adInfo.videoBuffer) {
    var bufferComponents = getBufferRange(index, content, adInfo.videoBuffer),
        _i = 0;

    for (_i; _i < bufferComponents.length; _i++) {
      if (!!componentNameInList(content[bufferComponents[_i]], videoComponents)) {
        return false;
      }
    }
  }

  return true;
}
/**
 * If the ad has a component count minimum, check for component minimum OR word count minimum.
 * If the ad type has no component count minimum, only check word count.
 * @param {adInfo} adInfo - The object containing information about the ad that is being passed in.
 * @returns {boolean}
 */


function counterChecksPass(adInfo) {
  return !!adInfo.componentCountMin ? wordCountQualifies(adInfo) || componentCountQualifies(adInfo) : wordCountQualifies(adInfo);
}
/**
 * Compares the word count for the passed-in ad to the word count minimum for that ad.
 * @param {adInfo} adInfo - The object containing information about the ad that is being passed in.
 * @returns {boolean}
 */


function wordCountQualifies(adInfo) {
  return adInfo.currentWordCounter >= adInfo.wordCountMin;
}
/**
 * Compares the current component count for the passed-in ad to the component count minimum for that ad.
 * @param {adInfo} adInfo - The object containing information about the ad that is being passed in.
 * @returns {boolean}
 */


function componentCountQualifies(adInfo) {
  return adInfo.currentComponentCounter >= adInfo.componentCountMin;
}
/**
 * Checks if the current componet is followed by at least the `endOfArticleCriteria`
 * number of count-incrementing components from the article end.
 * @param {index} index - The index of the component within the article content.
 * @param {content} content - The array of article content.
 * @param {integer} endOfArticleCriteria - The number of components before the end of an article that an ad can be inserted
 * @returns {boolean}
 */


function notNearArticleEnd(index, content, endOfArticleCriteria) {
  var i = index + 1,
      qualifyingComponents = 0;

  for (i; i < content.length; i++) {
    if (componentShouldIncrementCount(content[i])) {
      qualifyingComponents += 1;

      if (qualifyingComponents >= endOfArticleCriteria) {
        return true;
      }
    }
  }

  return false;
}
/**
 * Returns the number of words in the component. Any text property will be included in the word count.
 * @param {component} component - The component being passed in.
 * @returns {integer}
 */


function countWords(component) {
  return stripTags(component.text || '').split(' ').filter(function (word) {
    return word.trim();
  }).length;
}
/**
 * Checks if the component is the same type as one of the items in the list of items that is passed in.
 * @param {component} component - The component being passed in.
 * @param {bannedList} bannedList - Array containing strings of banned component names.
 * @returns {boolean}
 */


function componentNameInList(component, bannedList) {
  return !!bannedList.find(function (listItem) {
    return clayUtils.getComponentName(component._ref) === listItem;
  });
}
/**
 * Looks at the specified number of components (the buffer) above and below the current component,
 * and returns an array with a range beginning with the `firstToCheck` and ending with `lastToCheck`.
 * If `firstToCheck` is not a positive number, sets it to 0.
 * Does not look past the end of the article for `lastToCheck`.
 * @param {index} index - The index of the component within the article content.
 * @param {content} content - The array of article content.
 * @param {buffer} buffer - The number of components away to check
 * @returns {array}
 */


function getBufferRange(index, content, buffer) {
  var firstToCheck = Math.max(index - buffer, 0),
      lastToCheck = Math.min(index + buffer, content.length);
  return _range(firstToCheck, lastToCheck);
}
/**
 * Increment the component count unless the component is on the `nonIncrementingComponents` list, OR
 * unless the component is a paragraph that doesn't meet the minimum word count.
 * @param {component} component - The component being passed in.
 * @returns {boolean}
 */


function componentShouldIncrementCount(component) {
  return !componentNameInList(component, nonIncrementingComponents) && !(clayUtils.getComponentName(component._ref) === 'clay-paragraph' && countWords(component) < paragraphWordCountMin);
}

module.exports = function (articleData, mobileOnly) {
  var newContent = [],
      content = articleData.content,
      desktopOutstreamServed = false,
      mobileOutstreamServed = false,
      firstMobileBannerServed = false,
      freezeMobileInsertion = false,
      hasLede = utils.has(articleData.ledeUrl),
      contentCount = hasLede ? content.length + 1 : content.length,
      endOfArticleCriteria = 2,
      desktopBannerInfo = {
    wordCountMin: 500,
    componentCountMin: 5
  },
      mobileBannerInfo = {
    wordCountMin: 300,
    componentCountMin: 3
  },
      tabletBannerInfo = {
    wordCountMin: 300,
    componentCountMin: 4
  },
      mobileOutstreamInfo = {
    videoBuffer: 2,
    componentCountMin: 2,
    wordCountMin: 200
  },
      desktopOutstreamInfo = {
    wordCountMin: 250,
    videoBuffer: 3
  }; // Non-incrementing components shouldn't be counted in the `contentCount`
  // Loop over all components to check for non-incrementing components and remove them from `contentCount` total

  _forEach(content, function (component) {
    if (!!nonIncrementingComponents.find(function (listItem) {
      return clayUtils.getComponentName(component._ref) === listItem;
    })) {
      contentCount -= 1;
    }
  }); // initialize counters


  desktopBannerInfo.currentWordCounter = 0;
  desktopBannerInfo.currentComponentCounter = 0;
  mobileBannerInfo.currentWordCounter = 0;
  mobileBannerInfo.currentComponentCounter = 0;
  tabletBannerInfo.currentWordCounter = 0;
  tabletBannerInfo.currentComponentCounter = 0;
  desktopOutstreamInfo.currentWordCounter = 0;
  desktopOutstreamInfo.currentComponentCounter = 0;
  mobileOutstreamInfo.currentWordCounter = 0;
  mobileOutstreamInfo.currentComponentCounter = 0; // editors have the ability to hide ads on the article using the UI
  // if editors are hiding ads, just return content without iterating through components

  if (!!articleData.shouldHideAds && content) {
    return content;
  } else if (!articleData.shouldHideAds && content) {
    // An article lede image is set in the article data itself, and not as a child component.
    // If the article data has a `ledeUrl`, then we need to increment our counters to 1 from the get go, in order to properly insert ads
    if (hasLede) {
      desktopBannerInfo.currentComponentCounter = 1;
      mobileBannerInfo.currentComponentCounter = 1;
      tabletBannerInfo.currentComponentCounter = 1;
    } // for short articles, we want to be able to place an ad within one component of the end
    // and insert mobile and tablet ads every 2 components
    // if it's a longer article, an ad shouldn't appear within three components of the end


    if (contentCount <= mobileBannerInfo.componentCountMin + endOfArticleCriteria) {
      endOfArticleCriteria = shortArticleEndOfArticleCriteria;
      mobileBannerInfo.componentCountMin = shortArticleComponentCountMin;
      tabletBannerInfo.componentCountMin = shortArticleComponentCountMin;
    } else {
      endOfArticleCriteria = longArticleEndOfArticleCriteria;
      mobileBannerInfo.componentCountMin = longArticleMobileComponentCountMin;
      tabletBannerInfo.componentCountMin = longArticleTabletComponentCountMin;
    } // loop over the content object of the articleData, each object in the content object is a component


    _forEach(content, function (component, index) {
      // for each ad, keep track of the words and components since the last ad of its type was served
      // also see whether component is too close to the end of the article
      var componentWordCount = countWords(component),
          notNearEndOfArticle = notNearArticleEnd(index, content, endOfArticleCriteria); // add the component to the array first

      newContent.push(component);
      desktopBannerInfo.currentWordCounter += componentWordCount;
      mobileBannerInfo.currentWordCounter += componentWordCount;
      tabletBannerInfo.currentWordCounter += componentWordCount;
      desktopOutstreamInfo.currentWordCounter += componentWordCount; // increment the component count if the current component is an incrementing component

      if (componentShouldIncrementCount(component)) {
        desktopBannerInfo.currentComponentCounter += 1;
        mobileBannerInfo.currentComponentCounter += 1;
        tabletBannerInfo.currentComponentCounter += 1;
        desktopOutstreamInfo.currentComponentCounter += 1; // after the first mobile banner serves, start incrementing the counts for the mobile outstream

        if (firstMobileBannerServed) {
          mobileOutstreamInfo.currentWordCounter += componentWordCount;
          mobileOutstreamInfo.currentComponentCounter += 1;
        }
      } // insert desktop banner ads and reset counters


      if (!mobileOnly && articleData.inArticleDesktopBanner && notNearEndOfArticle && runChecks(index, content, component, desktopBannerInfo)) {
        newContent.push(articleData.inArticleDesktopBanner);
        desktopBannerInfo.currentWordCounter = 0;
        desktopBannerInfo.currentComponentCounter = 0;
      } // insert mobile banner ads and reset counters


      if (!freezeMobileInsertion && articleData.inArticleMobileAd && notNearEndOfArticle && runChecks(index, content, component, mobileBannerInfo)) {
        newContent.push(articleData.inArticleMobileAd);

        if (articleData.inArticleMobileLandscapeAd) {
          newContent.push(articleData.inArticleMobileLandscapeAd);
        }

        mobileBannerInfo.currentWordCounter = 0;
        mobileBannerInfo.currentComponentCounter = 0;
        firstMobileBannerServed = true;
      } // insert mobile outstream ad once first mobile ad is inserted
      // while this ad is being inserted all other mobile insertion should halt


      if (articleData.inArticleMobileOutStreamAd && notNearEndOfArticle && firstMobileBannerServed && !mobileOutstreamServed) {
        freezeMobileInsertion = true;

        if (runChecks(index, content, component, mobileOutstreamInfo)) {
          newContent.push(articleData.inArticleMobileOutStreamAd);
          mobileOutstreamServed = true; // mobile ad insertion can now carry on
          // bump up the current counts for mobile insertion so that the next ad (and next one only) uses the outstream minimums instead

          mobileBannerInfo.currentWordCounter = mobileBannerInfo.wordCountMin - mobileOutstreamInfo.wordCountMin;
          mobileBannerInfo.currentComponentCounter = mobileBannerInfo.componentCountMin - mobileOutstreamInfo.componentCountMin;
          freezeMobileInsertion = false;
        }
      } // insert tablet banner ads and reset counters


      if (!mobileOnly && articleData.inArticleTabletAd && notNearEndOfArticle && runChecks(index, content, component, tabletBannerInfo)) {
        newContent.push(articleData.inArticleTabletAd);
        tabletBannerInfo.currentWordCounter = 0;
        tabletBannerInfo.currentComponentCounter = 0;
      } // insert desktop outstream ad and set status to served so that this ad only appears once


      if (!mobileOnly && articleData.inArticleDesktopOutStreamAd && notNearEndOfArticle && !desktopOutstreamServed && runChecks(index, content, component, desktopOutstreamInfo)) {
        newContent.push(articleData.inArticleDesktopOutStreamAd);
        desktopOutstreamServed = true;
      }
    });
  }

  ;
  return newContent;
};
}, {"27":27,"42":42,"43":43,"56":56,"907":907}];
