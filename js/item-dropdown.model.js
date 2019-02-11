window.modules["item-dropdown.model"] = [function(require,module,exports){'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var queryService = require(49);

module.exports.render = function (uri, data, locals) {
  if (data.index && data.itemTextField && data.itemLinkField) {
    var index = data.index,
        query = queryService(index, locals),
        fields = [data.itemTextField, data.itemLinkField];
    queryService.onlyWithTheseFields(query, fields);
    queryService.addSize(query, 500);
    queryService.addMinimumShould(query, 1);

    if (!!data.sortProperty) {
      queryService.addSort(query, _defineProperty({}, data.sortProperty, 'asc'));
    }

    return queryService.searchByQuery(query).then(function (results) {
      data.items = results.map(function (item) {
        return {
          itemTextField: item[data.itemTextField],
          itemLinkField: item[data.itemLinkField]
        };
      });
      return data;
    }).catch(function (e) {
      queryService.logCatch(e, uri);
      return data;
    });
  } else {
    return data;
  }
};
}, {"49":49}];
