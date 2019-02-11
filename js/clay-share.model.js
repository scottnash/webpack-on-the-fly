window.modules["clay-share.model"] = [function(require,module,exports){'use strict';
/**
 * set component canonical url if it's passed in through the locals
 * @param {object} data
 * @param {object} [locals]
 */

function setUrl(data, locals) {
  if (locals && locals.publishUrl) {
    data.url = locals.publishUrl;
  }
}
/**
 *
 * @param {string} ref
 * @param {object} data
 * @param {object} [locals]
 * @returns {{type: string, key: string, value: {}}}
 */


module.exports.save = function (ref, data, locals) {
  setUrl(data, locals); // save the canonical url on PUT because on GET locals does not have canonicalUrl.

  return data;
};
}, {}];
