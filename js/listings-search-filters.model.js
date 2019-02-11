window.modules["listings-search-filters.model"] = [function(require,module,exports){'use strict';

var _sortBy = require(102);

module.exports.save = function (ref, data) {
  var groups = ['manhattanNabes', 'brooklynNabes', 'queensNabes', 'otherNabes'];
  var clientData = {};
  groups.forEach(function (group) {
    // ensure that neighborhoods are sorted alphabetically
    data[group] = _sortBy(data[group], function (nabe) {
      return nabe.text;
    });
    clientData[group] = data[group].map(function (val) {
      return {
        type: 'neighborhood',
        value: val.text
      };
    });
  });
  data.clientData = clientData;
  return data;
};
}, {"102":102}];
