window.modules["96"] = [function(require,module,exports){'use strict';

var engine = require(1170);
/**
 * localstorage that falls back to in-memory storage
 * supports set(key, value), get(key), remove(key), clearAll(), and each((value, key) => {})
 * api docs: https://www.npmjs.com/package/store
 * @type {[type]}
 */


module.exports = engine.createStore([// storages
require(1172), require(1173)], [// plugins
require(1169)]);
}, {"1169":1169,"1170":1170,"1172":1172,"1173":1173}];
