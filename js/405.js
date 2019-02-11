window.modules["405"] = [function(require,module,exports){var TYPE = require(392).TYPE;
var LEFTPARENTHESIS = TYPE.LeftParenthesis;
var RIGHTPARENTHESIS = TYPE.RightParenthesis;

module.exports = {
    name: 'Parentheses',
    structure: {
        children: [[]]
    },
    parse: function(readSequence, recognizer) {
        var start = this.scanner.tokenStart;
        var children = null;

        this.scanner.eat(LEFTPARENTHESIS);
        children = readSequence.call(this, recognizer);
        this.scanner.eat(RIGHTPARENTHESIS);

        return {
            type: 'Parentheses',
            loc: this.getLocation(start, this.scanner.tokenStart),
            children: children
        };
    },
    generate: function(node) {
        return [].concat('(', this.each(node.children), ')');
    }
};
}, {"392":392}];
