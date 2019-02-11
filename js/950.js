window.modules["950"] = [function(require,module,exports){var prepare = require(972);
var initialMergeRuleset = require(964);
var mergeAtrule = require(966);
var disjoinRuleset = require(967);
var restructShorthand = require(968);
var restructBlock = require(969);
var mergeRuleset = require(970);
var restructRuleset = require(971);

module.exports = function(ast, usageData, debug) {
    // prepare ast for restructing
    var indexer = prepare(ast, usageData);
    debug('prepare', ast);

    initialMergeRuleset(ast);
    debug('initialMergeRuleset', ast);

    mergeAtrule(ast);
    debug('mergeAtrule', ast);

    disjoinRuleset(ast);
    debug('disjoinRuleset', ast);

    restructShorthand(ast, indexer);
    debug('restructShorthand', ast);

    restructBlock(ast);
    debug('restructBlock', ast);

    mergeRuleset(ast);
    debug('mergeRuleset', ast);

    restructRuleset(ast);
    debug('restructRuleset', ast);
};
}, {"964":964,"966":966,"967":967,"968":968,"969":969,"970":970,"971":971,"972":972}];
