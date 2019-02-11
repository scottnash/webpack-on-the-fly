window.modules["435"] = [function(require,module,exports){var List = require(394);
var COMMA = require(392).TYPE.Comma;

module.exports = {
    name: 'MediaQueryList',
    structure: {
        children: [['MediaQuery']]
    },
    parse: function(relative) {
        var children = new List();

        this.scanner.skipSC();

        while (!this.scanner.eof) {
            children.appendData(this.MediaQuery(relative));

            if (this.scanner.tokenType !== COMMA) {
                break;
            }

            this.scanner.next();
        }

        return {
            type: 'MediaQueryList',
            loc: this.getLocationFromList(children),
            children: children
        };
    },
    generate: function(node) {
        return this.eachComma(node.children);
    }
};
}, {"392":392,"394":394}];
