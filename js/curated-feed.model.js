window.modules["curated-feed.model"] = [function(require,module,exports){'use strict';

var _map = require(37),
    _get = require(32),
    _sortBy = require(102),
    _includes = require(33),
    DomParser = require(100),
    domParser = new DomParser(),
    recircCmpt = require(103),
    mediaplayService = require(53),
    sanitize = require(39),
    _require = require(101),
    getEmbedHTMLForTweet = _require.getEmbedHTMLForTweet,
    getCleanTweetUrl = _require.getCleanTweetUrl,
    getUsernameFromTweetUrl = _require.getUsernameFromTweetUrl,
    parsers = require(99),
    orderCuratedItemsByDateDesc = function orderCuratedItemsByDateDesc(items) {
  return _sortBy(items || [], ['date']).reverse();
},
    ELASTIC_FIELDS = ['date', 'primaryHeadline', 'feedImgUrl', 'pageUri', 'byline'],
    CONTENT_CHANNEL_SANITIZED_NAMES = {
  'Politics-Domestic': 'Politics',
  'Politics-International': 'International',
  'Internet-Culture': 'The Internet',
  'Products-Apps-Software': 'Software',
  'Products-Consumer-Electronics': 'Gadgets',
  'Tech-Industry': 'Technology',
  'Tech-Society': 'Technology'
};
/**
 * 
 * @param {string[]} tags 
 * @returns {string}
 */


function getArticlePresentationByTags(tags) {
  if (_includes(tags, 'top story')) {
    return 'feature';
  }

  return 'small';
}
/**
 * 
 * @param {object} article 
 * @param {string[]} secondaryRubricTags
 * @returns {string}
 */


function getArticleSecondaryRubric(article, secondaryRubricTags) {
  var tags = article.tags,
      contentChannel = article.contentChannel,
      sanitizedContentChannel = _get(CONTENT_CHANNEL_SANITIZED_NAMES, contentChannel, contentChannel);

  for (var i = 0; i < secondaryRubricTags.length; i++) {
    if (_includes(tags, secondaryRubricTags[i])) {
      return secondaryRubricTags[i];
    }
  }

  return sanitizedContentChannel ? sanitizedContentChannel.replace('-', ' ') : '';
}
/**
 * 
 * @param {object} curatedItem 
 * @param {string} ref 
 * @param {object} locals 
 * @returns {Promise<object>}
 */


function expandRelatedLink(curatedItem, ref, locals) {
  if (!curatedItem.relatedLink) {
    return Promise.resolve(curatedItem);
  } else {
    var request = {
      url: curatedItem.relatedLink
    };
    return recircCmpt.getArticleDataAndValidate(ref, request, locals, ELASTIC_FIELDS).then(function (res) {
      var feedImgUrl = res.feedImgUrl,
          byline = res.byline,
          primaryHeadline = res.primaryHeadline,
          date = res.date;
      curatedItem.relatedDate = new Date(date).toISOString();
      curatedItem.relatedFeedImgUrl = mediaplayService.getRendition(mediaplayService.cleanUrl(feedImgUrl), 'square-small');
      curatedItem.relatedByline = byline;
      curatedItem.relatedHeadline = primaryHeadline;
      return curatedItem;
    }).catch(function () {
      return curatedItem;
    });
  }
}

function sanitizeFields(item) {
  item.remark = sanitize.validateTagContent(sanitize.toSmartText(item.remark || ''));
  item.quickChat = sanitize.validateTagContent(sanitize.toSmartText(item.quickChat || ''));
  item.quote = sanitize.validateTagContent(sanitize.toSmartText(item.quote || ''));
  item.attribution = sanitize.validateTagContent(sanitize.toSmartText(item.attribution || ''));
  item.relatedLinkRemark = sanitize.validateTagContent(sanitize.toSmartText(item.relatedLinkRemark || ''));
  return item;
}
/**
 * Post process curated items to include any additional information
 * that might need to be attached including:
 * 
 * 1. Related Links elements need to be expanded so that they include
 *    enough information about the actual article so that they can
 *    be rendered properly
 * 2. Retrieve mediaplay image metadata for Image type curated items
 * 3. Retrive twitter contents for Tweet type curated items
 * 4. All items need to be sanitized for empty tag content, and usage
 *    of smart quotes and other special typographic characters.
 * 
 * @param {object} curatedItem 
 * @param {string} ref 
 * @param {object} locals 
 * @returns {Promise<object>}
 */


function decorateCuratedItem(curatedItem, ref, locals) {
  return expandRelatedLink(curatedItem, ref, locals).then(function (item) {
    sanitizeFields(item);

    if (item.type === 'image') {
      return decorateImageItem(item);
    } else if (item.type === 'tweet') {
      return decorateTweetItem(item);
    }

    return item;
  });
}
/**
 * Retrieve mediaplay image metadata for Image type curated items
 * 
 * @param {object} item 
 * @returns {Promise<object>}
 */


function decorateImageItem(item) {
  var imageUrl = item.imageUrl;

  if (!imageUrl) {
    delete item.imageCredit;
    delete item.imageType;
    delete item.dynamicImage;
    /* @todo decide on a warning log here */

    return item;
  }

  return mediaplayService.getMediaplayMetadata(imageUrl).catch(function () {
    return {};
  }).then(function (metadata) {
    item.imageCredit = metadata.credit;
    item.imageType = metadata.imageType;
    item.dynamicImage = {
      url: imageUrl,
      mobile: 'curated-feed-image-post',
      tablet: 'curated-feed-image-post',
      desktop: 'curated-feed-image-post'
    };
    return item;
  });
}

function cleanupTweetItem(item) {
  delete item.quote;
  delete item.link;
  delete item.attribution;
  delete item.tweetValid;
  delete item.tweetRetrieved;
}
/**
 * Retrieve Twitter metadata for Tweet type curated items
 * 
 * @param {object} item 
 * @returns {Promise<object>}
 */


function decorateTweetItem(item) {
  var tweetValid = item.tweetValid,
      tweetUrl = item.tweetUrl,
      tweetRetrieved = item.tweetRetrieved;

  if (!tweetUrl) {
    // We don't have a tweet url, possibly because it was deleted
    cleanupTweetItem(item);
    return item;
  } else if (tweetValid && tweetRetrieved === tweetUrl) {
    // We already got this tweet
    return item;
  }

  return getEmbedHTMLForTweet(tweetUrl, true, true).then(function (tweetEmbedHTML) {
    var tweetEmbedDom = domParser.parseFromString(tweetEmbedHTML),
        paragraphs = tweetEmbedDom.getElementsByTagName('p');
    item.quote = paragraphs.length ? paragraphs[0].innerHTML : '';
    item.link = getCleanTweetUrl(tweetUrl);
    item.attribution = '@' + getUsernameFromTweetUrl(tweetUrl);
    item.tweetValid = true;
    item.tweetRetrieved = tweetUrl;
    return item;
  }).catch(function () {
    cleanupTweetItem(item);
    return item;
  });
}
/**
 * Post process whatever is coming out of the Published Articles
 * index so that it can be properly sorted and presented in
 * the template.
 * 
 * @param {object[]} articles 
 * @param {string[]} secondaryRubricTags
 * @returns {object[]}
 */


function processPublishedArticles(articles, secondaryRubricTags) {
  return articles.map(function (article) {
    var presentation = getArticlePresentationByTags(_get(article, 'tags', [])),
        secondaryRubric = getArticleSecondaryRubric(article, secondaryRubricTags);
    article.presentation = presentation;
    article.secondaryRubric = secondaryRubric;
    article.date = new Date(article.date).toISOString();
    article.dynamicImage = {
      url: article.feedImgUrl,
      mobile: presentation === 'feature' ? 'curated-feed-article-feature' : 'square',
      tablet: presentation === 'feature' ? 'curated-feed-article-feature' : 'square',
      desktop: presentation === 'feature' ? 'curated-feed-article-feature-large' : 'curated-feed-article-large'
    };
    return article;
  });
}
/**
 * Given a sorted list of article items and a sorted list of curated items
 * merge the two lists preserving the two sorts.
 * 
 * @param {object[]} articles 
 * @param {object[]} curated 
 * @returns {object[]}
 */


function combineArticlesAndFeed(articles, curated) {
  var feed = [],
      articleIndex = 0,
      curatedIndex = 0;

  while (articleIndex < articles.length && curatedIndex < curated.length) {
    var article = articles[articleIndex],
        curatedItem = curated[curatedIndex];

    if (new Date(article.date).toISOString() < new Date(curatedItem.date).toISOString()) {
      feed.push(curatedItem);
      curatedIndex++;
    } else {
      feed.push(article);
      articleIndex++;
    }
  }

  while (articleIndex < articles.length) {
    var _article = articles[articleIndex];
    feed.push(_article);
    articleIndex++;
  }

  while (curatedIndex < curated.length) {
    var _curatedItem = curated[curatedIndex];
    feed.push(_curatedItem);
    curatedIndex++;
  }

  return feed;
}

function getScopes(scopes) {
  if (scopes && scopes.length) {
    return _map(scopes, function (scope) {
      return scope.text;
    });
  } else {
    return [];
  }
}

module.exports.render = function (ref, data, locals) {
  var combinedFeed = data.combinedFeed,
      site = locals.site,
      edit = locals.edit,
      _ref = site || {},
      assetHost = _ref.assetHost;

  data.combinedFeed = (combinedFeed || []).map(function (item) {
    if (item.type && item.type === 'quick-chat') {
      var quickChat = (_get(item, 'quickChat') || '').trim(),
          parsedQuickChat = parsers.slack(quickChat.replace(/<br \/>/g, '\n')).map(function (chat) {
        var handle = chat.handle;
        chat.avatarUrl = "".concat(assetHost, "/media/components/curated-feed/").concat(handle, ".jpg");
        return chat;
      });
      item.parsedQuickChat = parsedQuickChat;
      item.autoCollapse = parsedQuickChat.reduce(function (accum, i) {
        accum += i.messageCount;
        return accum;
      }, 0) > 7;
    }

    if (edit && item.type && item.type === 'tweet') {
      if (!item.tweetUrl) {
        // We don't have any tweet data because there is no URL set
        item.quote = '[WARNING] No tweet URL set. This post will be hidden for readers.';
      } else if (!item.tweetValid) {
        // We were not able to retrieve data for a tweet URL successfully
        item.quote = '[WARNING] Tweet was not available. This post will be hidden for readers.';
      }
    }

    return item;
  });
  data.truncatedCombinedFeed = data.combinedFeed.slice(0, data.articleViewCutoff || 30);
  return data;
};

module.exports.save = function (ref, data, locals) {
  var curatedFeedItems = orderCuratedItemsByDateDesc(_get(data, 'curatedFeedItems', []).map(function (item) {
    item.date = item.date || new Date().toISOString();
    return item;
  })),
      secondaryRubricTags = (_get(data, 'secondaryRubricTags') || []).map(function (item) {
    return item.text;
  }),
      publishedArticles = processPublishedArticles(_get(data, 'cuneiformResults', []) || [], secondaryRubricTags);
  data.cuneiformScopes = getScopes(data.scopes); // these values are set in the template and in render, and can get accidentally saved through kiln
  // these values should never persist in data

  delete data.isOnArticlePage; // set in template

  delete data.feed; // set in template

  delete data.truncatedCombinedFeed; // set in render

  if (publishedArticles && publishedArticles.length > 0) {
    curatedFeedItems = curatedFeedItems.filter(function (curatedItem) {
      return new Date(curatedItem.date).toISOString() > new Date(publishedArticles[publishedArticles.length - 1].date).toISOString();
    });
  }
  /* @todo the curatedFeed could get kind of large (although most are directly resolved promises), maybe should use highland here? */


  return Promise.all(curatedFeedItems.map(function (item) {
    return decorateCuratedItem(item, ref, locals);
  })).then(function (decorated) {
    var combined = combineArticlesAndFeed(publishedArticles, decorated);
    data.curatedFeedItems = decorated;
    data.combinedFeed = combined;
    return data;
  });
};
}, {"32":32,"33":33,"37":37,"39":39,"53":53,"99":99,"100":100,"101":101,"102":102,"103":103}];
