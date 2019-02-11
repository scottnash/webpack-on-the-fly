window.modules["sponsored-pull-quote.model"] = [function(require,module,exports){'use strict';

var prettyQuotes = require(176),
    styles = require(44),
    utils = require(43),
    _set = require(87);

module.exports.save = function (uri, data) {
  // goes through the quote and replaces quotation marks with the html entity
  // then remove those HTML entities while setting a field 'hasQuoteMarks' to true
  // so that the template will render the appropriate quotation mark graphic
  data.quote = prettyQuotes.quotesToEntities(data.quote);

  if (prettyQuotes.hasQuoteMarks(data.quote)) {
    data.hasQuoteMarks = true;
    data.quote = prettyQuotes.removeQuoteEntities(data.quote, '').updatedString;
  }

  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      return _set(data, 'css', css);
    });
  } else {
    return data;
  }
};
}, {"43":43,"44":44,"87":87,"176":176}];
