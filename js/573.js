window.modules["573"] = [function(require,module,exports){'use strict';
var ansiRegex = require(249);
var re = new RegExp(ansiRegex().source); // remove the `g` flag
module.exports = re.test.bind(re);
}, {"249":249}];
