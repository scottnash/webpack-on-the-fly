window.modules["427"] = [function(require,module,exports){var TYPE = require(392).TYPE;
var IDENTIFIER = TYPE.Identifier;
var NUMBERSIGN = TYPE.NumberSign;

// '#' ident
module.exports = {
    name: 'IdSelector',
    structure: {
        name: String
    },
    parse: function() {
        this.scanner.eat(NUMBERSIGN);

        return {
            type: 'IdSelector',
            loc: this.getLocation(this.scanner.tokenStart - 1, this.scanner.tokenEnd),
            name: this.scanner.consume(IDENTIFIER)
        };
    },
    generate: function(node) {
        return '#' + node.name;
    }
};
}, {"392":392}];
