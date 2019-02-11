window.modules["410"] = [function(require,module,exports){var STRING = require(392).TYPE.String;

module.exports = {
    name: 'String',
    structure: {
        value: String
    },
    parse: function() {
        return {
            type: 'String',
            loc: this.getLocation(this.scanner.tokenStart, this.scanner.tokenEnd),
            value: this.scanner.consume(STRING)
        };
    },
    generate: function(node) {
        return node.value;
    }
};
}, {"392":392}];
