window.modules["circulation-subscription-page-list-title.model"] = [function(require,module,exports){'use strict';

var _includes = require(33);

module.exports.save = function (uri, data) {
  var pageListTitle = data.pageListTitle || '';

  if (data.prefix && !_includes(pageListTitle.toLowerCase(), data.prefix.toLowerCase())) {
    data.pageListTitle = "".concat(data.prefix, " ").concat(pageListTitle);
  }

  return data;
};
}, {"33":33}];
