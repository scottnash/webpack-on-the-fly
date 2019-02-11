window.modules["listing-metadata.model"] = [function(require,module,exports){'use strict';

var sanitize = require(39),
    toTitleCase = function toTitleCase(str) {
  if (str) {
    return str.toLowerCase().replace(/(^| )(\w)/g, function (s) {
      return s.toUpperCase();
    });
  }

  return;
};

module.exports.save = function (ref, data, locals) {
  if (data.title) {
    data.slug = sanitize.cleanSlug(data.title);
  }

  if (locals && locals.publishUrl) {
    data.canonicalUrl = locals.publishUrl;
  }

  data = sanitize.recursivelyStripSeperators(data);
  data.kilnTitle = "Listing - ".concat(toTitleCase(data.category) || 'Uncategorized', " - ").concat(data.title || 'Untitled');
  return data;
};
}, {"39":39}];
