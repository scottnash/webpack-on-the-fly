window.modules["44"] = [function(require,module,exports){'use strict';

var postcss = require(1094),
    nested = require(1012),
    safe = require(1053),
    csso = require(931),
    simpleVars = require(1093);
/**
 * render scoped css using postcss
 * @param {string} uri
 * @param {string} styles
 * @returns {string}
 */


function render(uri, styles) {
  var wrapped = "[data-uri=\"".concat(uri, "\"] {\n      ").concat(styles, "\n    }");
  return postcss([nested, simpleVars, csso]).process(wrapped, {
    parser: safe
  }).then(function (result) {
    return result.css;
  });
}

module.exports.render = render;
}, {"931":931,"1012":1012,"1053":1053,"1093":1093,"1094":1094}];
