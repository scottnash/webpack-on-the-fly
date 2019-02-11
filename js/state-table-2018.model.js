window.modules["state-table-2018.model"] = [function(require,module,exports){'use strict';

var _forEach = require(27),
    striptags = require(42),
    utils = require(43),
    styles = require(44);

module.exports.save = function (ref, data) {
  // Allow line breaks in the lengthy piece of text
  _forEach(data.dataEntries, function (entry) {
    if (utils.has(entry.whyItsInPlay)) {
      entry.whyItsInPlay = striptags(entry.whyItsInPlay, ['br']).replace(/\n/g, '<br/>');
    }

    if (utils.has(entry.whyItMatters)) {
      entry.whyItMatters = striptags(entry.whyItMatters, ['br']).replace(/\n/g, '<br/>');
    }

    if (utils.has(entry.toSwingSenate)) {
      entry.toSwingSenate = striptags(entry.toSwingSenate, ['br']).replace(/\n/g, '<br/>');
    }

    if (utils.has(entry.toSwingHouse)) {
      entry.toSwingHouse = striptags(entry.toSwingHouse, ['br']).replace(/\n/g, '<br/>');
    }
  }); // Per-instance styles


  if (utils.isFieldEmpty(data.sass)) {
    delete data.css;
    return data;
  } else {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  }
};
}, {"27":27,"42":42,"43":43,"44":44}];
