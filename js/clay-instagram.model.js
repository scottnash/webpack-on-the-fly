window.modules["clay-instagram.model"] = [function(require,module,exports){'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var rest = require(5),
    instagramApiBaseUrl = 'https://api.instagram.com/oembed/?omitscript=true&url=',
    INSTAGRAM_POST_URL_RE = /(https?:\/\/(?:www.)?instagram\.com\/(\w+)\/([\w-]+))/;
/**
 * determine if an instagram post should hide its caption
 * @param {object} data
 * @returns {string}
 */


function hideCaption(data) {
  return data.showCaption === false ? '&hidecaption=true' : '';
}

module.exports.render = function (uri, data) {
  var url = data.url,
      _ref = INSTAGRAM_POST_URL_RE.exec(url) || [null, null, null, null],
      _ref2 = _slicedToArray(_ref, 4),
      igPostId = _ref2[3];

  data.igPostId = igPostId;
  return data;
};
/**
 * ask instagram for embed html
 * @param {string} uri
 * @param {object} data
 * @returns {Promise}
 */


module.exports.save = function (uri, data) {
  if (data.url) {
    // note: we're using the un-authenticated api endpoint. don't abuse this
    return rest.get(instagramApiBaseUrl + encodeURI(data.url) + hideCaption(data)).then(function (json) {
      // get instagram oembed html
      data.html = json.html;
      return data;
    }).catch(function () {
      return data;
    }); // fail gracefully
  } else {
    data.html = ''; // clear the html if there's no url

    return Promise.resolve(data);
  }
};
}, {"5":5}];
