window.modules["tidal.model"] = [function(require,module,exports){'use strict';

module.exports.render = function (ref, data) {
  if (data.embedType) {
    switch (data.embedType) {
      case 'a':
        data.embedClass = 'album';
        break;

      case 'p':
        data.embedClass = 'playlist';
        break;

      case 't':
        data.embedClass = 'track';
        break;

      case 'v':
        data.embedClass = 'video';
        break;

      default:
        data.embedClass = 'track';
    }
  }

  return data;
};

module.exports.save = function (ref, data) {
  // Tidal urls come in the format https://tidal.com/embedType/embedId
  var tidalRegex = /https?:\/\/tidal.com\/(track|album|playlist|video)\/(\S+)/;
  var regexMatch;
  data.embedType = '';
  data.embedId = '';

  if (data.itemUrl) {
    regexMatch = data.itemUrl.match(tidalRegex); // if we have a match, it should consist of [full url, type, id]

    if (regexMatch && regexMatch.length === 3) {
      // we only want to use the first letter of the matched type (e.g. 't' for 'track')
      data.embedType = regexMatch[1].slice(0, 1); // grab the full id - this is generally a number or guid

      data.embedId = regexMatch[2];
    }
  }

  return data;
};
}, {}];
