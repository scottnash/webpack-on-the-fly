window.modules["love-map.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44),
    sanitize = require(39);

function sanitizeEntries(entries) {
  var i;

  for (i = 0; i < entries.length; i++) {
    entries[i].address = sanitize.toSmartText(entries[i].address);
    entries[i].plainAddress = sanitize.toPlainText(entries[i].address);
    entries[i].story = sanitize.toSmartText(entries[i].story);
  }
}

module.exports.save = function (ref, data) {
  if (utils.has(data.loveEntries)) {
    sanitizeEntries(data.loveEntries);
  }

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
}, {"39":39,"43":43,"44":44}];
