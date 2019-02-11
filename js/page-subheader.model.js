window.modules["page-subheader.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39);
/**
 * save subheader
 * @param  {string} uri
 * @param  {object} data
 * @return {Promise}
 */


module.exports.save = function (uri, data) {
  var text = data.text || ''; // sanitize text input

  data.text = sanitize.validateTagContent(sanitize.toSmartText(text));
  return data;
};
}, {"39":39}];
