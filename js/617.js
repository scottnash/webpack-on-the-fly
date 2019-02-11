window.modules["617"] = [function(require,module,exports){// Standard YAML's Core schema.
// http://www.yaml.org/spec/1.2/spec.html#id2804923
//
// NOTE: JS-YAML does not support schema-specific tag resolution restrictions.
// So, Core schema has no distinctions from JSON schema is JS-YAML.


'use strict';


var Schema = require(614);


module.exports = new Schema({
  include: [
    require(620)
  ]
});
}, {"614":614,"620":620}];
