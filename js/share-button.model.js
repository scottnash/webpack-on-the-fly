window.modules["share-button.model"] = [function(require,module,exports){'use strict';
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

module.exports.save = function (ref, data, locals) {
  setUrl(data, locals);
  return data;
};
}, {}];
