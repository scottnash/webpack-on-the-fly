window.modules["clay-subheader.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    styles = require(44),
    utils = require(43);
/**
 * save subheader
 * @param  {string} uri
 * @param  {object} data
 * @return {Promise}
 */


module.exports.save = function (uri, data) {
  var text = data.text || ''; // sanitize text input

  data.text = sanitize.validateTagContent(sanitize.toSmartText(text)); // compile styles if they're not empty

  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = ''; // unset any compiled css

    return Promise.resolve(data); // we don't HAVE to return a promise here, but it makes testing easier
  }
};
}, {"39":39,"43":43,"44":44}];
