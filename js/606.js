window.modules["606"] = [function(require,module,exports){'use strict';
var numberIsNan = require(607);

module.exports = Number.isFinite || function (val) {
	return !(typeof val !== 'number' || numberIsNan(val) || val === Infinity || val === -Infinity);
};
}, {"607":607}];
