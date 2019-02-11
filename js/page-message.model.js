window.modules["page-message.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44),
    sanitize = require(39),
    striptags = require(42);

module.exports.save = function (ref, data) {
  data.text = sanitize.toSmartText(striptags(data.text, ['em', 'i', 'strong', 'b', 'span', 'a']));

  if (utils.isFieldEmpty(data.sass)) {
    delete data.css;
    return data;
  } else {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  }
};
}, {"39":39,"42":42,"43":43,"44":44}];
