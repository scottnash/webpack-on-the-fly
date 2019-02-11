window.modules["620"] = [function(require,module,exports){// Standard YAML's JSON schema.
// http://www.yaml.org/spec/1.2/spec.html#id2803231
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, this schema is not such strict as defined in the YAML specification.
// It allows numbers in binary notaion, use `Null` and `NULL` as `null`, etc.


'use strict';


var Schema = require(614);


module.exports = new Schema({
  include: [
    require(619)
  ],
  implicit: [
    require(637),
    require(638),
    require(639),
    require(636)
  ]
});
}, {"614":614,"619":619,"636":636,"637":637,"638":638,"639":639}];
