window.modules["top-picks-item.model"] = [function(require,module,exports){'use strict';

var utils = require(43),
    mediaPlay = require(53),
    _assign = require(57),
    _pickBy = require(59),
    recircCmpt = require(103),
    toPlainText = require(39).toPlainText,
    ELASTIC_FIELDS = ['primaryHeadline', 'authors', 'pageUri'];
/**
 * Merge query results into data
 * @param  {object} data - Instance data
 * @param  {object} result - Recirc query result
 * @return {object}
 */


function assignToData(data, result) {
  _assign(data, _pickBy({
    plaintextTitle: toPlainText(result.primaryHeadline),
    authors: result.authors,
    pageUri: result.pageUri
  }));

  if (utils.has(data.imageUrl)) {
    data.imageUrl = mediaPlay.getRendition(data.imageUrl, 'square');
  }

  return data;
}

module.exports.save = function (ref, data, locals) {
  return recircCmpt.getArticleDataAndValidate(ref, data, locals, ELASTIC_FIELDS).then(function (result) {
    return assignToData(data, result);
  });
};
}, {"39":39,"43":43,"53":53,"57":57,"59":59,"103":103}];
