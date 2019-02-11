window.modules["choreographer.model"] = [function(require,module,exports){'use strict';

var _kebabCase = require(70),
    has = require(43).has,
    timeout = require(46).timeout,
    put = require(69).put;

module.exports.save = function (uri, data, locals) {
  if (has(data.touts)) {
    data.touts = data.touts.map(function (tout) {
      tout.value = _kebabCase(tout.name);
      return tout;
    });
  } // when saving, rewrite /_lists/touts with the updated list of touts
  // note: for now, we're assuming /_lists/touts will be unique for each site.
  // change this logic in the future if they become true singletons or we need different
  // lists of touts in different layouts


  if (has(data.touts) && locals && locals.site && locals.site.prefix) {
    return timeout(put("".concat(locals.site.prefix, "/_lists/touts"), data.touts, locals), 1000).catch(console.error).then(function () {
      return data;
    });
  }

  return data;
};
}, {"43":43,"46":46,"69":69,"70":70}];
