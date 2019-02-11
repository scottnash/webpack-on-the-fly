window.modules["bar-line-chart.model"] = [function(require,module,exports){'use strict';

var styles = require(44),
    utils = require(43);

module.exports.save = function (uri, data) {
  // compile styles if they're not empty
  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    return Promise.resolve(data); // we don't HAVE to return a promise here, but it makes testing easier
  }
};
}, {"43":43,"44":44}];
