window.modules["949"] = [function(require,module,exports){var walk = require(378).walkUp;
var handlers = {
    Atrule: require(952),
    AttributeSelector: require(954),
    Value: require(959),
    Dimension: require(955),
    Percentage: require(956),
    Number: require(956),
    String: require(957),
    Url: require(958),
    HexColor: require(963).compressHex,
    Identifier: require(963).compressIdent,
    Function: require(963).compressFunction
};

module.exports = function(ast) {
    walk(ast, function(node, item, list) {
        if (handlers.hasOwnProperty(node.type)) {
            handlers[node.type].call(this, node, item, list);
        }
    });
};
}, {"378":378,"952":952,"954":954,"955":955,"956":956,"957":957,"958":958,"959":959,"963":963}];
