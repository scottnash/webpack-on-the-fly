window.modules["404"] = [function(require,module,exports){var NUMBER = require(392).TYPE.Number;

module.exports = {
    name: 'Number',
    structure: {
        value: String
    },
    parse: function() {
        return {
            type: 'Number',
            loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
            value: this.scanner.consume(NUMBER)
        };
    },
    generate: function(node) {
        return node.value;
    }
};
}, {"392":392}];
