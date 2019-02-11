window.modules["waypoint.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44),
    _set = require(87);

module.exports.save = function (uri, data) {
  if (utils.has(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      return _set(data, 'css', css);
    });
  } else {
    delete data.css;
    return data;
  }
};
}, {"43":43,"44":44,"87":87}];
