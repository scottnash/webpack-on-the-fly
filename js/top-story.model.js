window.modules["top-story.model"] = [function(require,module,exports){'use strict';

var _assign = require(57),
    _pickBy = require(59),
    recircCmpt = require(103),
    toPlainText = require(39).toPlainText,
    ELASTIC_FIELDS = ['shortHeadline', 'feedImgUrl', 'pageUri'];
/**
 * Merge query results into data
 * @param  {object} data - Instance data
 * @param  {object} result - Recirc query result
 * @return {object}
 */


function assignToData(data, result) {
  _assign(data, _pickBy({
    shortHeadline: result.shortHeadline,
    feedImgUrl: result.feedImgUrl,
    plaintextPrimaryHeadline: toPlainText(result.shortHeadline),
    pageUri: result.pageUri,
    urlIsValid: result.urlIsValid
  }));

  if (data.title) {
    data.plaintextTitle = toPlainText(data.title);
  }

  return data;
}

module.exports.save = function (ref, data, locals) {
  return recircCmpt.getArticleDataAndValidate(ref, data, locals, ELASTIC_FIELDS).then(function (result) {
    return assignToData(data, result);
  });
}; // export for upgrade.js


module.exports.assignToData = assignToData;
}, {"39":39,"57":57,"59":59,"103":103}];
