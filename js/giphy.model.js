window.modules["giphy.model"] = [function(require,module,exports){(function (process,__filename){
'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _get = require(32),
    log = require(81).setup({
  file: __filename,
  component: 'giphy'
}),
    rest = require(5),
    GIPHY_KEY = window.process.env.GIPHY_KEY,
    GIPHY_ENDPOINT = 'https://api.giphy.com/v1/gifs/',
    URL_PATTERN = /(?:https?:)?(?:\/\/)?(?:media)?\.?giphy\.com\/(embed|media|gifs)\/([\w\-]+)(?:\/[\w.\-]+)?/;
/**
 * Get giphy Id
 *
 * @param {string} url - giphy full url
 * @return {string} giphy id
 */


function getIdFromURLPattern(url) {
  var _ref = URL_PATTERN.exec(url) || [null, null, ''],
      _ref2 = _slicedToArray(_ref, 3),
      id = _ref2[2];

  if (id.includes('-')) {
    id = id.substring(id.lastIndexOf('-') + 1);
  }

  return id;
}
/**
 * Get giphy video and image url. API docs: https://developers.giphy.com/docs/#rendition-guide
 *
 * @param {Object} data - component data
 * @return {Promise}
 */


function getEmbedLinks(data) {
  var id = getIdFromURLPattern(data.url),
      request = "".concat(GIPHY_ENDPOINT).concat(id, "?api_key=").concat(GIPHY_KEY);
  return rest.get(request).then(function (jsonRes) {
    return {
      author: _get(jsonRes, 'data.user.display_name') || '',
      imgLinkDesktop: _get(jsonRes, 'data.images.original_still.url') || '',
      videoLinkDesktop: _get(jsonRes, 'data.images.original.mp4') || '',
      imgLinkMobile: _get(jsonRes, 'data.images.fixed_height_still.url') || '',
      videoLinkMobile: _get(jsonRes, 'data.images.fixed_height.mp4') || ''
    };
  }).then(function (embedLinks) {
    data.author = embedLinks.author;
    data.imgLinkDesktop = embedLinks.imgLinkDesktop;
    data.videoLinkDesktop = embedLinks.videoLinkDesktop;
    data.imgLinkMobile = embedLinks.imgLinkMobile;
    data.videoLinkMobile = embedLinks.videoLinkMobile;
    return data;
  }).catch(function (error) {
    log(error); // Invalid if error

    data.giphyUrlValid = false;
    return data;
  });
}

module.exports.save = function (uri, data) {
  var dataURL = data.url || '';
  var url = ''; // Assume valid at first

  data.giphyUrlValid = true;

  if (dataURL) {
    var _URL_PATTERN$exec = URL_PATTERN.exec(dataURL);

    var _URL_PATTERN$exec2 = _slicedToArray(_URL_PATTERN$exec, 1);

    url = _URL_PATTERN$exec2[0];
    data.url = url;
    return getEmbedLinks(data);
  } else {
    return data;
  }
};

}).call(this,require(22),"/components/giphy/model.js")}, {"5":5,"22":22,"32":32,"81":81}];
