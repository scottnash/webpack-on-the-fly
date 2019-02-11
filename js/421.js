window.modules["421"] = [function(require,module,exports){var CDC = require(392).TYPE.CDC;

module.exports = {
    name: 'CDC',
    structure: [],
    parse: function() {
        var start = this.scanner.tokenStart;

        this.scanner.eat(CDC); // -->

        return {
            type: 'CDC',
            loc: this.getLocation(start, this.scanner.tokenStart)
        };
    },
    generate: function() {
        return '-->';
    }
};
}, {"392":392}];
