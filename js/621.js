window.modules["621"] = [function(require,module,exports){// JS-YAML's default schema for `load` function.
// It is not described in the YAML specification.
//
// This schema is based on JS-YAML's default safe schema and includes
// JavaScript-specific types: !!js/undefined, !!js/regexp and !!js/function.
//
// Also this schema is used as default base schema at `Schema.create` function.


'use strict';


var Schema = require(614);


module.exports = Schema.DEFAULT = new Schema({
  include: [
    require(618)
  ],
  explicit: [
    require(625),
    require(626),
    require(624)
  ]
});
}, {"614":614,"618":618,"624":624,"625":625,"626":626}];
