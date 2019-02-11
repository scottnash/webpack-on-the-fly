window.modules["931"] = [function(require,module,exports){var postcss = require(934);
var compress = require(932).compress;
var postcssToCsso = require(933);
var cssoToPostcss = require(935);

var postcssCsso = postcss.plugin('postcss-csso', function postcssCsso(options) {
    return function(root, result) {
        result.root = cssoToPostcss(compress(postcssToCsso(root), options).ast);
    };
});

postcssCsso.process = function(css, options) {
    return postcss([postcssCsso(options)]).process(css);
};

module.exports = postcssCsso;
}, {"932":932,"933":933,"934":934,"935":935}];
