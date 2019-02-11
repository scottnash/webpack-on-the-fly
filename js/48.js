window.modules["48"] = [function(require,module,exports){'use strict';

var _get = require(32),
    _require = require(43),
    getSiteRootHost = _require.getSiteRootHost;
/**
 * The parsely "site id" is also referred to as the "api key"
 * Most of the time is is the root hostname, with a couple of exceptions below
 * @param {object} locals
 * @returns {string}
 */


function getParselySiteId(locals) {
  var rootHost = getSiteRootHost(locals),
      sitePath = _get(locals, 'site.path', '');

  if (rootHost === 'nymag.com' && (sitePath === '/intelligencer' || sitePath === '/strategist')) {
    return "".concat(sitePath.substr(1), ".").concat(rootHost);
  }

  return rootHost;
}

module.exports.getParselySiteId = getParselySiteId;
}, {"32":32,"43":43}];
