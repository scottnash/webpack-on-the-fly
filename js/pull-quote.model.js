window.modules["pull-quote.model"] = [function(require,module,exports){'use strict';

var prettyQuotes = require(176);

module.exports.save = function (uri, data) {
  // goes through the quote and replaces quotation marks with the html entity
  // then remove those HTML entities while setting a field 'hasQuoteMarks' to true
  // so that the template will render the appropriate quotation mark graphic
  data.quote = prettyQuotes.quotesToEntities(data.quote);

  if (prettyQuotes.hasQuoteMarks(data.quote)) {
    data.hasQuoteMarks = true;
    data.quote = prettyQuotes.removeQuoteEntities(data.quote, '').updatedString;
  }

  return data;
};
}, {"176":176}];
