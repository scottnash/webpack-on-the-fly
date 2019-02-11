window.modules["nav-link.model"] = [function(require,module,exports){'use strict';

var _assign = require(57),
    _pickBy = require(59),
    recircCmpt = require(103),
    ELASTIC_FIELDS = ['plaintextPrimaryHeadline', 'authors', 'pageUri'];
/**
 * Merge query results into data
 * @param  {object} data - Instance data
 * @param  {object} result - Recirc query result
 * @return {object}
 */


function assignToData(data, result) {
  _assign(data, _pickBy({
    plaintextPrimaryHeadline: result.plaintextPrimaryHeadline,
    authors: result.authors,
    pageUri: result.pageUri,
    urlIsValid: result.urlIsValid
  }));

  return data;
} // save is also imported into nav-link/upgrade.js


module.exports.save = function (ref, data, locals) {
  return recircCmpt.getArticleDataAndValidate(ref, data, locals, ELASTIC_FIELDS).then(function (result) {
    return assignToData(data, result);
  });
};
}, {"57":57,"59":59,"103":103}];
