window.modules["circulation-page-list-title.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (uri, data) {
  if (!data.pageListTitle && data.circPageListTitle) {
    data.pageListTitle = data.circPageListTitle;
  }

  return data;
};
}, {}];
