window.modules["972"] = [function(require,module,exports){var resolveKeyword = require(378).keyword;
var walkRules = require(378).walkRules;
var translate = require(378).translate;
var createDeclarationIndexer = require(973);
var processSelector = require(974);

function walk(node, markDeclaration, usageData) {
    switch (node.type) {
        case 'Rule':
            node.block.children.each(markDeclaration);
            processSelector(node, usageData);
            break;

        case 'Atrule':
            if (node.expression) {
                node.expression.id = null; // pre-init property to avoid multiple hidden class for translate
                node.expression.id = translate(node.expression);
            }

            // compare keyframe selectors by its values
            // NOTE: still no clarification about problems with keyframes selector grouping (issue #197)
            if (resolveKeyword(node.name).name === 'keyframes') {
                node.block.avoidRulesMerge = true;  /* probably we don't need to prevent those merges for @keyframes
                                                       TODO: need to be checked */
                node.block.children.each(function(rule) {
                    rule.selector.children.each(function(simpleselector) {
                        simpleselector.compareMarker = simpleselector.id;
                    });
                });
            }
            break;
    }
};

module.exports = function prepare(ast, usageData) {
    var markDeclaration = createDeclarationIndexer();

    walkRules(ast, function(node) {
        walk(node, markDeclaration, usageData);
    });

    return {
        declaration: markDeclaration
    };
};
}, {"378":378,"973":973,"974":974}];
