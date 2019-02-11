window.modules["omniture.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _map = require(37),
    _reduce = require(124);

var omniture = require(170);

DS.controller('omniture', [function () {
  /**
   * add static instance data
   * @param {object} s
   * @param {Element} el
   */
  function addStaticData(s, el) {
    var rsid = el.getAttribute('data-rsid'),
        prop1 = el.getAttribute('data-prop1'),
        prop2 = el.getAttribute('data-prop2'),
        prop12 = el.getAttribute('data-prop12'),
        prop42 = el.getAttribute('data-prop42'); // note: property definitions for static props are in schema.yml

    /* RSID (Domain Specific).
     *   nymag.com: "nymcom"
     *   nymag.com daily intel pages: "nymcom"
     *   thecut: "nymcom"
     *   vulture.com: "nymvulture"
     *   grubstreet.com: "nymp"
     *   science of us: "nymcom"
     */

    s.account = rsid;
    s.prop1 = prop1;
    s.prop2 = prop2;
    s.prop12 = prop12;
    s.prop42 = prop42;
  }
  /**
   * add page name (from url)
   * @param {object} s
   */


  function addPageName(s) {
    s.pageName = window.location.pathname;
  }
  /**
   * add headline (from og:title)
   * @param {object} s
   */


  function addProp4(s) {
    var ogTitle = dom.find('meta[property="og:title"]');

    if (ogTitle) {
      s.prop4 = ogTitle.content;
    }
  }
  /**
   * add tags (from meta keywords)
   * @param {object} s
   * @param {Element} article
   */


  function addProp5(s, article) {
    var keywords = dom.find('meta[property="article:tag"]'),
        content,
        parts,
        trimmed;

    if (keywords) {
      content = keywords.content;
      parts = content.split(',');
      trimmed = _map(parts, function (str) {
        return str.trim();
      }); // As of May, 2016 – 'Sponsored Post' pages use tags/keywords prefixed with 's '
      // Code below normalizes this issue for Sponsored Posts as we want 'sponsor post'
      // As other special cases arise, we will need to re-evaluate

      if (article && dom.matches(article, '.sponsored')) {
        trimmed.unshift('sponsor post');
      } // grab the first 15 and add them to the s.prop


      s.prop5 = trimmed.slice(0, 15).join(',');
    }
  }
  /**
   * add hierarchy
   * @param {object} s
   * @param {Element} article
   * @param {Element} el (omniture element)
   */


  function addProp6(s, article, el) {
    var prop6 = el.getAttribute('data-prop6'),
        contentChannel = article && article.getAttribute('data-content-channel'),
        hierarchy;

    if (contentChannel) {
      hierarchy = prop6.split(':'); // if there's a content channel, replace the section with it

      s.prop6 = hierarchy[0] + ':' + contentChannel + ':' + hierarchy[2];
    } else {
      // otherwise pass through prop6 (set in the omniture settings)
      s.prop6 = prop6;
    } // once we've figured out s.prop6, set s.channel as well
    // note: it's the full hierarchy, not just the content channel


    s.channel = s.prop6;
  }
  /**
   * add video boolean
   * @param {object} s
   * @param {Element} article
   */


  function addProp40(s, article) {
    var video = article && dom.find(article, '.video');

    if (video) {
      s.prop40 = true;
    }
  }
  /**
   * add authors (from article)
   * @param {object} s
   * @param {Element} article
   */


  function addProp41(s, article) {
    var authors = article && dom.findAll(article, '.article-author span'),
        // potentially multiple authors
    authorNames;

    if (authors) {
      authorNames = _map(authors, function (author) {
        return author.textContent; // get the author name from the span
      });
      s.prop41 = authorNames.join(',');
    }
  }
  /**
   * add feature rubric (from article)
   * @param {object} s
   * @param {Element} article
   */


  function addProp48(s, article) {
    var rubric = article && dom.find(article, '.rubric');

    if (rubric) {
      s.prop48 = rubric.innerText;
    }
  }
  /* eslint-disable complexity */

  /**
   * get the "bucket" from the count
   * @param {number} count
   * @returns {string}
   */


  function getBucket(count) {
    if (count <= 79) {
      return '79 words or less';
    } else if (count <= 125) {
      return '80-125 words';
    } else if (count <= 199) {
      return '126-199 words';
    } else if (count <= 399) {
      return '200-399 words';
    } else if (count <= 599) {
      return '400-599 words';
    } else if (count <= 999) {
      return '600-999 words';
    } else if (count <= 1499) {
      return '1000-1499 words';
    } else if (count <= 1999) {
      return '1500-1999 words';
    } else if (count >= 2000) {
      return '2000 words or more';
    }
  }
  /* eslint-enable complexity */

  /**
   * add word length
   * @param {object} s
   * @param {Element} article
   */


  function addProp53(s, article) {
    var paragraphs = article && dom.findAll(article, '.clay-paragraph'),
        count,
        bucket;

    if (paragraphs) {
      // first, count the text in the paragraphs
      count = _reduce(paragraphs, function (current, paragraph) {
        var text = paragraph.textContent,
            // FF v44 and lower do not support innerText, so using textContent for consistent stats.
        length = text && text.length || 0; // note: will be incorrect for non-latin characters

        return current + length;
      }, 0); // then, determine which "bucket" the current count falls into

      bucket = getBucket(count); // finally, set the s.prop

      s.prop53 = bucket;
    }
  }
  /**
   * add layout
   * @param {object} s
   */


  function addProp56(s) {
    var html = dom.find('html'),
        layoutUri = html && html.getAttribute('data-layout-uri'),
        layoutComponentName,
        layoutInstanceIdSansVersion;

    if (layoutUri) {
      layoutInstanceIdSansVersion = layoutUri.split('/').pop().split('@')[0];
      layoutComponentName = layoutUri.split('/components/').pop().split('/')[0];
      s.prop56 = layoutInstanceIdSansVersion + '/' + layoutComponentName;
    }
  }
  /**
   * add related-stories boolean
   * @param {object} s
   * @param {Element} article
   */


  function addProp60(s, article) {
    var video = article && dom.find(article, '.related-stories');

    if (video) {
      s.prop60 = true;
    }
  }
  /**
   * Matches a string to a specific case and returns
   * another string representing the syndication type
   *
   * @param  {String} string The type of syndication set when editing an article
   * @return {String}        The type of syndication for Omniture consumption
   */


  function getSyndicationType(string) {
    switch (string) {
      case 'original':
        return ',Syndication-1';
        break;

      case 'copy':
        return ',Syndication-2';
        break;

      default:
        return '';
        break;
    }
  }
  /**
   * Sets the Omniture value for crossposted if an
   * article can be crossposted to other sites
   *
   * @param  {String} string Sites to which this article can be crossposted
   * @return {String}        Crossposted property for Omniture consumption
   */


  function getCrossposting(string) {
    if (string && string.trim() !== '') {
      return ',Crossposted';
    }

    return '';
  }
  /**
   * Adds prop3 value based on static data and syndication value
   *
   * @param {Object} s
   * @param {Object} article
   * @param {Object} el
   */


  function addProp3(s, article) {
    if (article && article.dataset.type) {
      s.prop3 = article.dataset.type.split(', ').join(',');
      s.prop3 += getSyndicationType(article.dataset.syndication);
      s.prop3 += getCrossposting(article.dataset.crosspost);
    }
  } // remove question mark from the url string, and only take the "utm specific params.
  // decode the URL and pass as a string to s.campaign


  function setCampaign(s) {
    var params,
        queries,
        i,
        location = window.location.search.split('?')[1],
        utm = [];

    if (location && location.indexOf('utm') > -1) {
      queries = location.split('&');

      for (i = 0; i < queries.length; i++) {
        if (queries[i].indexOf('utm') > -1) {
          utm.push(queries[i]);
        }
      }

      params = decodeURIComponent(utm.join());
    }

    s.campaign = params;
  }

  function Constructor(el) {
    // set everything up
    var s = omniture.pre(),
        article = dom.find('.article') || dom.find('.lede-video'),
        sCode; // then populate `s` with some data
    // static data from omniture template / component instance

    addStaticData(s, el); // dynamic data from page

    addPageName(s);
    addProp3(s, article);
    addProp4(s);
    addProp5(s, article);
    addProp6(s, article, el); // prop6 (hierarchy) uses both static and dynamic data

    addProp40(s, article);
    addProp41(s, article);
    addProp48(s, article);
    addProp53(s, article);
    addProp56(s);
    addProp60(s, article);
    setCampaign(s); // then let omniture do some more stuff based on that data

    s = omniture.post(s); // then track page view

    sCode = s.t();

    if (sCode) {
      // sometimes this doesn't exist, I guess?
      document.write(sCode);
    }
  }

  return Constructor;
}]);
}, {"1":1,"37":37,"124":124,"170":170}];
