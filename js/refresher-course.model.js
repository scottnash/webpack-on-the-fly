window.modules["refresher-course.model"] = [function(require,module,exports){'use strict';

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
    data.css = ''; // unset any compiled css

    return data;
  }
};
}, {"43":43,"44":44}];
