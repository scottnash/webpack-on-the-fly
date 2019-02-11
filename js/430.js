window.modules["430"] = [function(require,module,exports){var TYPE = require(392).TYPE;
var IDENTIFIER = TYPE.Identifier;

module.exports = {
    name: 'Identifier',
    structure: {
        name: String
    },
    parse: function() {
        return {
            type: 'Identifier',
            loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
            name: this.scanner.consume(IDENTIFIER)
        };
    },
    generate: function(node) {
        return node.name;
    }
};
}, {"392":392}];
