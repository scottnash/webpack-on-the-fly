window.modules["611"] = [function(require,module,exports){'use strict';


var loader = require(616);
var dumper = require(615);


function deprecated(name) {
  return function () {
    throw new Error('Function ' + name + ' is deprecated and cannot be used.');
  };
}


module.exports.Type                = require(613);
module.exports.Schema              = require(614);
module.exports.FAILSAFE_SCHEMA     = require(619);
module.exports.JSON_SCHEMA         = require(620);
module.exports.CORE_SCHEMA         = require(617);
module.exports.DEFAULT_SAFE_SCHEMA = require(618);
module.exports.DEFAULT_FULL_SCHEMA = require(621);
module.exports.load                = loader.load;
module.exports.loadAll             = loader.loadAll;
module.exports.safeLoad            = loader.safeLoad;
module.exports.safeLoadAll         = loader.safeLoadAll;
module.exports.dump                = dumper.dump;
module.exports.safeDump            = dumper.safeDump;
module.exports.YAMLException       = require(612);

// Deprecated schema names from JS-YAML 2.0.x
module.exports.MINIMAL_SCHEMA = require(619);
module.exports.SAFE_SCHEMA    = require(618);
module.exports.DEFAULT_SCHEMA = require(621);

// Deprecated functions from JS-YAML 1.x.x
module.exports.scan           = deprecated('scan');
module.exports.parse          = deprecated('parse');
module.exports.compose        = deprecated('compose');
module.exports.addConstructor = deprecated('addConstructor');
}, {"612":612,"613":613,"614":614,"615":615,"616":616,"617":617,"618":618,"619":619,"620":620,"621":621}];
