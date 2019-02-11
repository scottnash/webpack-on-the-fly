window.modules["greatest-hit.model"] = [function(require,module,exports){'use strict';

var _assign = require(57),
    _pickBy = require(59),
    recircCmpt = require(103),
    toPlainText = require(39).toPlainText,
    ELASTIC_FIELDS = ['primaryHeadline', 'feedImgUrl', 'pageUri'];
/**
 * Merge query results into data
 * @param  {object} data - Instance data
 * @param  {object} result - Recirc query result
 * @return {object}
 */


function assignToData(data, result) {
  _assign(data, _pickBy({
    title: data.overrideTitle || result.primaryHeadline,
    image: data.overrideImage || result.feedImgUrl,
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
