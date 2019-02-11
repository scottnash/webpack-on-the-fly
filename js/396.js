window.modules["396"] = [function(require,module,exports){var List = require(394);
var TYPE = require(392).TYPE;

var STRING = TYPE.String;
var IDENTIFIER = TYPE.Identifier;
var LEFTPARENTHESIS = TYPE.LeftParenthesis;

module.exports = {
    parse: {
        expression: function() {
            var children = new List();

            this.scanner.skipSC();

            switch (this.scanner.tokenType) {
                case STRING:
                    children.appendData(this.String());
                    break;

                case IDENTIFIER:
                    children.appendData(this.Url());
                    break;

                default:
                    this.scanner.error('String or url() is expected');
            }

            if (this.scanner.lookupNonWSType(0) === IDENTIFIER ||
                this.scanner.lookupNonWSType(0) === LEFTPARENTHESIS) {
                children.appendData(this.WhiteSpace());
                children.appendData(this.MediaQueryList());
            }

            return children;
        },
        block: false
    }
};
}, {"392":392,"394":394}];
