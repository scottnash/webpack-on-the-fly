window.modules["quote-generator.client"] = [function(require,module,exports){'use strict';

var dom = require(1);

DS.controller('quote-generator', ['$document', '$window', function ($document, $window) {
  var quote;

  function Constructor(el) {
    this.el = el;
    this.quoteContainer = dom.find(el, '.quotes-wrapper');
    this.quoteTitle = dom.find(el, '.quote');
    this.quotes = el.getAttribute('data-quotes');
    this.quotesArray = this.quotes.split('\\n '); // split the string after new line

    this.shareFacebook = dom.find(el, '.facebook-share-button');
    this.shareTwitter = dom.find(el, '.twitter-share-button');
    this.twitterSite = dom.find('meta[name="twitter:site"]').getAttribute('content');
    this.shareButtonContainer = dom.find(el, '.share-button-container');
    this.generated = false;
    this.canonicalEl = dom.find('link[rel="canonical"]');
    this.shareURL = this.canonicalEl && this.canonicalEl.getAttribute('href');
    this.shareImg = dom.find('meta[property="og:image"]').getAttribute('content');
    this.shareTitle = dom.find('meta[property="og:title"]').getAttribute('content');
    this.shareDescription = dom.find('meta[property="og:description"]').getAttribute('content');
    this.positionLeft = Math.ceil($window.innerWidth / 2 - 300);
    this.positionTop = Math.ceil($window.innerHeight / 2 - 127);
    this.loadQuotes();
  }

  Constructor.prototype = {
    events: {
      '.quotes-button click': 'newQuote',
      '.facebook-share-button click': 'shareToFacebook',
      '.twitter-share-button click': 'shareToTwitter'
    },
    // Strip html tags from string
    cleanText: function cleanText(quote) {
      var html = quote,
          div = document.createElement('div'),
          text;
      div.innerHTML = html;
      text = div.textContent || div.innerText || '';
      return text;
    },
    // Share the score to Facebook
    shareToFacebook: function shareToFacebook() {
      FB.ui({
        method: 'feed',
        link: this.shareURL + '?mid=facebook-share-' + this.shareTitle,
        picture: this.shareImg,
        name: this.shareTitle,
        caption: this.cleanText(quote),
        description: this.shareDescription
      });
    },
    // Share the score to Twitter, as delivered by the child iframe
    shareToTwitter: function shareToTwitter() {
      var message = this.cleanText(quote) + ' ' + this.shareURL + '?mid=twitter-share-' + this.shareTitle.toLowerCase() + ' ' + this.twitterSite;
      $window.open('http://twitter.com/intent/tweet?source=tweetbutton&amp;text=' + encodeURIComponent(message), 'Tweet', 'width=600,height=300,left=' + this.positionLeft + ',top=' + this.positionTop);
    },
    // Randomly pick new quote
    loadQuotes: function loadQuotes() {
      quote = this.quotesArray[Math.ceil(Math.random() * this.quotesArray.length - 1)];
      this.quoteTitle.innerHTML = quote;
    },
    newQuote: function newQuote() {
      if (!this.generated) {
        this.generated = true;
        this.quoteContainer.classList.add('reveal');
      }

      this.loadQuotes();
    }
  };
  return Constructor;
}]);
}, {"1":1}];
