window.modules["406"] = [function(require,module,exports){var TYPE = require(392).TYPE;

var NUMBER = TYPE.Number;
var PERCENTSIGN = TYPE.PercentSign;

module.exports = {
    name: 'Percentage',
    structure: {
        value: String
    },
    parse: function() {
        var start = this.scanner.tokenStart;
        var number = this.scanner.consume(NUMBER);

        this.scanner.eat(PERCENTSIGN);

        return {
            type: 'Percentage',
            loc: this.getLocation(start, this.scanner.tokenStart),
            value: number
        };
    },
    generate: function(node) {
        return node.value + '%';
    }
};
}, {"392":392}];
