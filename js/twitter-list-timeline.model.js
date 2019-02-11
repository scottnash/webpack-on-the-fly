window.modules["twitter-list-timeline.model"] = [function(require,module,exports){'use strict';

var parse = require(38);

module.exports.save = function (ref, data) {
  if (data.url) {
    var url = parse(data.url),
        parts = url.pathname.split('/'),
        screenName = parts[1],
        listName = parts[3];

    if (url.host === 'twitter.com' && screenName && listName && parts[2] === 'lists') {
      data.screenName = screenName;
      data.listName = listName;
    } else {
      throw new Error('invalid URL');
    }
  } else {
    delete data.screenName;
    delete data.listName;
  }

  return data;
};
}, {"38":38}];
