window.modules["438"] = [function(require,module,exports){var List = require(394);
var TYPE = require(392).TYPE;

var COMMA = TYPE.Comma;
var LEFTCURLYBRACKET = TYPE.LeftCurlyBracket;
var BALANCED = true;

module.exports = {
    name: 'SelectorList',
    structure: {
        children: [['Selector']]
    },
    parse: function() {
        var children = new List();

        while (!this.scanner.eof) {
            children.appendData(this.parseSelector
                ? this.Selector()
                : this.Raw(BALANCED, COMMA, LEFTCURLYBRACKET)
            );

            if (this.scanner.tokenType === COMMA) {
                this.scanner.next();
                continue;
            }

            break;
        }

        return {
            type: 'SelectorList',
            loc: this.getLocationFromList(children),
            children: children
        };
    },
    generate: function(node) {
        return this.eachComma(node.children);
    },
    walkContext: 'selector'
};
}, {"392":392,"394":394}];
