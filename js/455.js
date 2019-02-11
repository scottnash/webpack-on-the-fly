window.modules["455"] = [function(require,module,exports){var List = require(394);
var BALANCED = true;

// legacy IE function
// expression '(' raw ')'
module.exports = function() {
    return new List().appendData(
        this.Raw(BALANCED, 0, 0)
    );
};
}, {"394":394}];
