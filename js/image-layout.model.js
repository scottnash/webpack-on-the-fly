window.modules["image-layout.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    styles = require(44);

module.exports.render = function (ref, data) {
  data.numOfImages = data.images.length === 2 ? 'two' : 'one';
  return data;
};

module.exports.save = function (ref, data) {
  // compile styles if they're not empty
  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = ''; // unset any compiled css

    return Promise.resolve(data); // we don't HAVE to return a promise here, but it makes testing easier
  }
};
}, {"43":43,"44":44}];
