window.modules["comments-link.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _get = require(32),
    _isFinite = require(89),
    ajax = require(88);

DS.controller('comments-link', [function () {
  var CORAL_TALK_API_ENDPOINT = '/coral-talk/api/v1/graph/ql',
      TALK_ASSET_URL = 'http://' + document.documentElement.getAttribute('data-uri') + '.html';

  function Constructor(el) {
    this.el = el;
    this.commentsCount = dom.find(el, '.comments-link-count');
    this.commentsText = dom.find(el, '.comments-link-text');
    this.isNavVariation = el.classList.contains('comments-link_article-nav');
    this.cutoffCnt = el.getAttribute('data-cutoffCnt') || 1000; // If we're not on an `@published` page then let's
    // not do anything. That way only canonical urls
    // or published instances actually see the comments.

    if (!this.shouldRenderCommentStream()) return;
    fetchCommentCount(this.onCommentCountFetched.bind(this));
  }

  Constructor.prototype.onCommentCountFetched = function (err, count) {
    if (err) return console.warn(err);

    if (count > 0) {
      if (this.isNavVariation && count < this.cutoffCnt) {
        this.commentsCount.innerHTML = '+';
      } else {
        this.commentsCount.innerHTML = count;
      }

      this.commentsText.innerHTML = 'Comment' + (count > 1 ? 's' : '');
      this.el.classList.remove('no-comments');
    }
  };
  /**
   * Returns true if the comment stream should be rendered.
   * @return {boolean}
   */


  Constructor.prototype.shouldRenderCommentStream = function () {
    return TALK_ASSET_URL.indexOf('@published') !== -1;
  };
  /**
   * Fetches the comment count of the current URL.
   * @param {function} callback node-style; arg1 is err, arg2 is count
   */


  function fetchCommentCount(callback) {
    ajax.sendReceiveJson({
      method: 'GET',
      url: CORAL_TALK_API_ENDPOINT + '?query={asset(url:"' + TALK_ASSET_URL + '"){totalCommentCount}}',
      dataType: 'json'
    }, function (err, result) {
      var count = _get(result, 'data.asset.totalCommentCount', 0);

      if (err) return callback(err);

      if (!_isFinite(count)) {
        return callback('Unexpected Coral-Talk response');
      }

      callback(null, count);
    });
  }

  return Constructor;
}]);
}, {"1":1,"32":32,"88":88,"89":89}];
