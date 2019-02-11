window.modules["product.client"] = [function(require,module,exports){'use strict';

var thirdParty = require(78),
    page = require(116);

module.exports = function () {
  var siteName = page.getSiteName();

  if (siteName === 'The Strategist') {
    thirdParty.includeScript('http://assets.pinterest.com/js/pinit.js');
  }
};
}, {"78":78,"116":116}];
