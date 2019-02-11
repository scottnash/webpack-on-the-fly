window.modules["618"] = [function(require,module,exports){// JS-YAML's default schema for `safeLoad` function.
// It is not described in the YAML specification.
//
// This schema is based on standard YAML's Core schema and includes most of
// extra types described at YAML tag repository. (http://yaml.org/type/)


'use strict';


var Schema = require(614);


module.exports = new Schema({
  include: [
    require(617)
  ],
  implicit: [
    require(631),
    require(632)
  ],
  explicit: [
    require(627),
    require(628),
    require(629),
    require(630)
  ]
});
}, {"614":614,"617":617,"627":627,"628":628,"629":629,"630":630,"631":631,"632":632}];
