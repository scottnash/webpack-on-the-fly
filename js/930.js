window.modules["930"] = [function(require,module,exports){'use strict';
module.exports = function (str, plural, count) {
	if (typeof plural === 'number') {
		count = plural;
		plural = str + 's';
	}

	return count === 1 ? str : plural;
};
}, {}];
