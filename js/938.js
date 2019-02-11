window.modules["938"] = [function(require,module,exports){'use strict';
var ansiRegex = require(249)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};
}, {"249":249}];
