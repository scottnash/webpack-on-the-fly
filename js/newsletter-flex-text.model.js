window.modules["newsletter-flex-text.model"] = [function(require,module,exports){'use strict';

var _find = require(71),
    sanitize = require(39);

module.exports.save = function save(ref, data) {
  var tvShow = {},
      sanitizedShowName = '';

  if (data.pageShowName && data.subscriptionOption === 'tv recap') {
    tvShow = _find(data.tvShowsList, function (show) {
      sanitizedShowName = sanitize.toSmartText(sanitize.toPlainText(show.name));
      return sanitizedShowName.toLowerCase() === data.pageShowName.toLowerCase();
    }) || {};
  }

  data.title = tvShow.title || data.defaultTitle;
  data.description = tvShow.description || data.defaultDescription || data.description;
  data.newsletterId = tvShow.newsletterId || data.defaultNewsletterId;
  return data;
};
}, {"39":39,"71":71}];
