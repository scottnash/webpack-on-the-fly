window.modules["dual-scroll.model"] = [function(require,module,exports){'use strict';

var isFieldEmpty = require(43).isFieldEmpty,
    styles = require(44),
    _set = require(87);

module.exports.save = function (uri, data) {
  return isFieldEmpty(data.sass) ? _set(data, 'css', '') : styles.render(uri, data.sass).then(function (css) {
    return _set(data, 'css', css);
  });
};
}, {"43":43,"44":44,"87":87}];
