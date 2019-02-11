window.modules["chart-data.model"] = [function(require,module,exports){'use strict';

var _forEach = require(27); // Splits the data into an easily readable object


function TSV2Object(data) {
  var finalDataObject = {
    data: {}
  },
      test = encodeURIComponent(data.data).split('%0A');

  _forEach(test, function (spreadsheetData) {
    var splitData = spreadsheetData.split('%09');
    finalDataObject.data[splitData[0]] = splitData[1];
  });

  data.transformedData = JSON.stringify(finalDataObject);
  return Promise.resolve(data);
}

module.exports.save = function (uri, data) {
  return TSV2Object(data);
};
}, {"27":27}];
