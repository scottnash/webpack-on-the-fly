window.modules["90"] = [function(require,module,exports){'use strict';

var createDOMPurify = require(525); // Sanitizes HTML to prevent XSS attacks; see https://github.com/cure53/DOMPurify


module.exports = createDOMPurify(window).sanitize;
}, {"525":525}];
