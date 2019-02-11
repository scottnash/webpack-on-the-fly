window.modules["462"] = [function(require,module,exports){var List = require(394);
var ALLOW_OF_CLAUSE = true;

module.exports = {
    parse: function() {
        return new List().appendData(
            this.Nth(ALLOW_OF_CLAUSE)
        );
    }
};
}, {"394":394}];
