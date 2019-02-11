window.modules["subscription-account-setup-header.model"] = [function(require,module,exports){'use strict';

var _require = require(43),
    has = _require.has,
    sanitize = require(39);
/**
 * sanitize headlines and teasers
 * @param  {object} data
 */


function sanitizeInputs(data) {
  if (has(data.accountSettingsHeadline)) {
    data.accountSettingsHeadline = sanitize.toSmartHeadline(data.accountSettingsHeadline);
  }

  if (has(data.subDescription)) {
    data.subDescription = sanitize.toSmartHeadline(data.subDescription);
  }
}

module.exports.save = function (uri, data) {
  sanitizeInputs(data);
  return data;
};
}, {"39":39,"43":43}];
