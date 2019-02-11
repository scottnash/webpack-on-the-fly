window.modules["413"] = [function(require,module,exports){var endsWith = require(392).endsWith;
var TYPE = require(392).TYPE;

var WHITESPACE = TYPE.Whitespace;
var COMMENT = TYPE.Comment;
var LEFTPARENTHESIS = TYPE.LeftParenthesis;
var COLON = TYPE.Colon;
var SEMICOLON = TYPE.Semicolon;
var EXCLAMATIONMARK = TYPE.ExclamationMark;
var BALANCED = true;

// 'progid:' ws* 'DXImageTransform.Microsoft.' ident ws* '(' .* ')'
function checkProgid(scanner) {
    var offset = 0;

    for (var type; type = scanner.lookupType(offset); offset++) {
        if (type !== WHITESPACE && type !== COMMENT) {
            break;
        }
    }

    if (scanner.lookupValue(offset, 'alpha') ||
        scanner.lookupValue(offset, 'chroma') ||
        scanner.lookupValue(offset, 'dropshadow')) {
        if (scanner.lookupType(offset + 1) !== LEFTPARENTHESIS) {
            return false;
        }
    } else {
        if (scanner.lookupValue(offset, 'progid') === false ||
            scanner.lookupType(offset + 1) !== COLON) {
            return false;
        }
    }

    return true;
}

module.exports = {
    name: 'Value',
    structure: {
        children: [[]]
    },
    parse: function(property) {
        // special parser for filter property since it can contains non-standart syntax for old IE
        if (property !== null && endsWith(property, 'filter') && checkProgid(this.scanner)) {
            this.scanner.skipSC();
            return this.Raw(BALANCED, SEMICOLON, EXCLAMATIONMARK);
        }

        var start = this.scanner.tokenStart;
        var children = this.readSequence(this.scope.Value);

        return {
            type: 'Value',
            loc: this.getLocation(start, this.scanner.tokenStart),
            children: children
        };
    },
    generate: function(node) {
        return this.each(node.children);
    }
};
}, {"392":392}];
