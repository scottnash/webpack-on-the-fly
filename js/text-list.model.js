window.modules["text-list.model"] = [function(require,module,exports){'use strict';

var _forEach = require(27),
    striptags = require(42),
    utils = require(43),
    styles = require(44),
    sanitize = require(39);

module.exports.save = function (uri, data) {
  if (utils.has(data.items)) {
    data.items = _forEach(data.items, function (itm) {
      itm.text = sanitize.toSmartText(striptags(itm.text, ['strong', 'em', 's', 'a', 'span']));
    });
  }

  if (utils.isFieldEmpty(data.sass)) {
    delete data.css;
    return data;
  } else {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  }
};
}, {"27":27,"39":39,"42":42,"43":43,"44":44}];
