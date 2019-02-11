window.modules["imgur.model"] = [function(require,module,exports){(function (process){
'use strict';

var urlParse = require(38),
    _includes = require(33),
    _get = require(32),
    _last = require(24),
    _isArray = require(129),
    rest = require(5),
    API_KEY = window.process.env.IMGUR_KEY,
    HEADERS = {
  Authorization: "Client-ID ".concat(API_KEY)
};
/**
 * determine if a path is from an album or gallery
 * @param {string} path
 * @returns {boolean}
 */


function isAlbum(path) {
  return _includes(path, '/a/');
}
/**
 * get an ID from an album or gallery
 * e.g. '/a/albumID', '/gallery/galleryID', '/galleryID'
 * @param {string} path
 * @returns {string}
 */


function getID(path) {
  return _last(path.split('/'));
}

function parseImgurData(data) {
  return function (imgurResponse) {
    var imgurData = imgurResponse.data,
        isAlbum = _isArray(imgurData.images); // an "album" always has an images array
    // even if it's empty / contains one image


    return {
      url: data.url,
      id: isAlbum ? "a/".concat(imgurData.id) : imgurData.id,
      // albums need to embed with a/<id>
      // note: galleries that are also albums can simply be linked to the album ID
      title: imgurData.title || '<span class="imgur-empty">No Title</span>',
      // empty titles get special styling in edit mode
      // note: in practice, titles should almost never be empty. sometimes they are for single images, though
      img: isAlbum ? _get(imgurData, 'images[0].link') : imgurData.link // note: `link` in albums is actually a link to the album. in single-image galleries
      // and images, it's a direct link to the image file
      // also note: we're assuming the first album image is the cover image.
      // imgur's api defines a cover ID, but there's nothing in imgur's UI
      // where someone could make a different image the cover, so it might be extraneous

    };
  };
}
/**
 * get single image data
 * @param {string} path
 * @param {object} data
 * @returns {Function}
 */


function getImgurImageData(path, data) {
  return function () {
    return rest.get("https://api.imgur.com/3/image/".concat(getID(path)), {
      headers: HEADERS
    }).then(parseImgurData(data));
  };
}
/**
 * get image and title from imgur
 * note: "albums" are collections of multiple images,
 * but albums might also be galleries, and galleries might be albums,
 * but not always. oh also there are images that aren't in galleries OR albums.
 * @param {object} data
 * @returns {Promise}
 */


function getImgurData(data) {
  var path = urlParse(data.url).pathname;

  if (isAlbum(path)) {
    // it's an album. it'll need some special parsing
    return rest.get("https://api.imgur.com/3/album/".concat(getID(path)), {
      headers: HEADERS
    }).then(parseImgurData(data)); // if anything fails, it'll throw an error
  } else {
    // it's a gallery or image
    return rest.get("https://api.imgur.com/3/gallery/".concat(getID(path)), {
      headers: HEADERS
    }).then(parseImgurData(data)).catch(getImgurImageData(path, data)); // images and galleries have the exact same url structure!
  }
}

module.exports.save = function (ref, data) {
  return data.url ? getImgurData(data) : data;
};

}).call(this,require(22))}, {"5":5,"22":22,"24":24,"32":32,"33":33,"38":38,"129":129}];
