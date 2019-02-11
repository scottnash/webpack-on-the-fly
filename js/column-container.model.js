window.modules["column-container.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    striptags = require(42),
    utils = require(43),
    styles = require(44);

module.exports.save = function (ref, data) {
  data.cta = sanitize.toSmartText(striptags(data.cta, ['strong', 'em', 'span'])); // compile styles if they're not empty

  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    return Promise.resolve(data); // we don't HAVE to return a promise here, but it makes testing easier
  }
};
}, {"39":39,"42":42,"43":43,"44":44}];
