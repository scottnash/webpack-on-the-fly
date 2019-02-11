window.modules["946"] = [function(require,module,exports){var walk = require(378).walkUp;
var handlers = {
    Atrule: require(940),
    Rule: require(943),
    Declaration: require(942),
    TypeSelector: require(944),
    Comment: require(941),
    Operator: require(945)
};

module.exports = function(ast, usageData) {
    walk(ast, function(node, item, list) {
        if (handlers.hasOwnProperty(node.type)) {
            handlers[node.type].call(this, node, item, list, usageData);
        }
    });
};
}, {"378":378,"940":940,"941":941,"942":942,"943":943,"944":944,"945":945}];
