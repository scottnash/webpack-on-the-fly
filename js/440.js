window.modules["440"] = [function(require,module,exports){var List = require(394);
var TYPE = require(392).TYPE;

var WHITESPACE = TYPE.Whitespace;
var COMMENT = TYPE.Comment;
var SEMICOLON = TYPE.Semicolon;
var COMMERCIALAT = TYPE.CommercialAt;
var LEFTCURLYBRACKET = TYPE.LeftCurlyBracket;
var RIGHTCURLYBRACKET = TYPE.RightCurlyBracket;

module.exports = {
    name: 'Block',
    structure: {
        children: [['Atrule', 'Rule', 'Declaration']]
    },
    parse: function(defaultConsumer) {
        defaultConsumer = defaultConsumer || this.Declaration;

        var start = this.scanner.tokenStart;
        var children = new List();

        this.scanner.eat(LEFTCURLYBRACKET);

        scan:
        while (!this.scanner.eof) {
            switch (this.scanner.tokenType) {
                case RIGHTCURLYBRACKET:
                    break scan;

                case WHITESPACE:
                case COMMENT:
                case SEMICOLON:
                    this.scanner.next();
                    break;

                case COMMERCIALAT:
                    children.appendData(this.Atrule());
                    break;

                default:
                    children.appendData(defaultConsumer.call(this));
            }
        }

        this.scanner.eat(RIGHTCURLYBRACKET);

        return {
            type: 'Block',
            loc: this.getLocation(start, this.scanner.tokenStart),
            children: children
        };
    },
    generate: function(node) {
        return [].concat('{', this.each(node.children), '}');
    },
    walkContext: 'block'
};
}, {"392":392,"394":394}];
