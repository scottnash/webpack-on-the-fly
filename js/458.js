window.modules["458"] = [function(require,module,exports){var List = require(394);

module.exports = function createConvertors(walker) {
    var walk = walker.all;
    var walkUp = walker.allUp;

    return {
        fromPlainObject: function(ast) {
            walk(ast, function(node) {
                if (node.children && node.children instanceof List === false) {
                    node.children = new List().fromArray(node.children);
                }
            });

            return ast;
        },
        toPlainObject: function(ast) {
            walkUp(ast, function(node) {
                if (node.children && node.children instanceof List) {
                    node.children = node.children.toArray();
                }
            });

            return ast;
        }
    };
};
}, {"394":394}];
