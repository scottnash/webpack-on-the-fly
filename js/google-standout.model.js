window.modules["google-standout.model"] = [function(require,module,exports){'use strict';
/**
 * set component reference url if it's passed in through the locals
 * @param {object} data
 * @param {object} [locals]
 */

function setUrl(data, locals) {
  if (locals && locals.publishUrl) {
    data.referenceUrl = locals.publishUrl;
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
  setUrl(data, locals);
  return data;
};
}, {}];
