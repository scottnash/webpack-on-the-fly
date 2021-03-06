window.modules["456"] = [function(require,module,exports){var List = require(394);
var TYPE = require(392).TYPE;

var IDENTIFIER = TYPE.Identifier;
var COMMA = TYPE.Comma;
var HYPHENMINUS = TYPE.HyphenMinus;
var EXCLAMATIONMARK = TYPE.ExclamationMark;
var BALANCED = true;

// var '(' ident (',' <value>? )? ')'
module.exports = function() {
    var children = new List();

    this.scanner.skipSC();

    var identStart = this.scanner.tokenStart;

    this.scanner.eat(HYPHENMINUS);
    if (this.scanner.source.charCodeAt(this.scanner.tokenStart) !== HYPHENMINUS) {
        this.scanner.error('HyphenMinus is expected');
    }
    this.scanner.eat(IDENTIFIER);

    children.appendData({
        type: 'Identifier',
        loc: this.getLocation(identStart, this.scanner.tokenStart),
        name: this.scanner.substrToCursor(identStart)
    });

    this.scanner.skipSC();

    if (this.scanner.tokenType === COMMA) {
        children.appendData(this.Operator());
        children.appendData(this.parseCustomProperty
            ? this.Value(null)
            : this.Raw(BALANCED, HYPHENMINUS, EXCLAMATIONMARK)
        );
    }

    return children;
};
}, {"392":392,"394":394}];
