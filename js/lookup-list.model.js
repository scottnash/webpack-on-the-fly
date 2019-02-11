window.modules["lookup-list.model"] = [function(require,module,exports){'use strict';

var _sortBy = require(102),
    striptags = require(42),
    sanitize = require(39),
    utils = require(43),
    ALLOWED_TAGS = ['em', 'i', 'strong', 'b', 's', 'strike'];

module.exports.save = function (ref, data) {
  // sanitize title
  if (utils.has(data.title)) {
    data.title = sanitize.toSmartText(striptags(data.title, ALLOWED_TAGS));
  }

  if (utils.has(data.items)) {
    // sanitize each item's text
    data.items.forEach(function (itm) {
      itm.text = sanitize.toSmartText(striptags(itm.text, ALLOWED_TAGS));
    }); // sort items

    if (data.sortAlphabetically) {
      data.items = _sortBy(data.items, function (itm) {
        return itm.text.toLowerCase().startsWith('the ') ? itm.text.slice(4) : itm.text;
      });
    }
  }

  return data;
};
}, {"39":39,"42":42,"43":43,"102":102}];
