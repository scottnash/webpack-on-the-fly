window.modules["398"] = [function(require,module,exports){var TYPE = require(392).TYPE;
var LEFTCURLYBRACKET = TYPE.LeftCurlyBracket;

module.exports = {
    parse: {
        expression: function() {
            if (this.scanner.lookupNonWSType(0) === LEFTCURLYBRACKET) {
                return null;
            }

            return this.SelectorList();
        },
        block: function() {
            return this.Block(this.Declaration);
        }
    }
};
}, {"392":392}];
