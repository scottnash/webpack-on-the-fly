window.modules["952"] = [function(require,module,exports){var resolveKeyword = require(378).keyword;
var compressKeyframes = require(953);

module.exports = function(node) {
    // compress @keyframe selectors
    if (resolveKeyword(node.name).name === 'keyframes') {
        compressKeyframes(node);
    }
};
}, {"378":378,"953":953}];
