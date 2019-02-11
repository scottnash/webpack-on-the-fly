window.modules["homepage-config.model"] = [function(require,module,exports){(function (process){
'use strict';

var cuneiformCmpt = require(95),
    INDEX = 'published-articles',
    ELASTIC_PREFIX = window.process.env.ELASTIC_PREFIX,
    DEFAULT_ELASTIC_INDEX = (ELASTIC_PREFIX ? ELASTIC_PREFIX + '_' : '') + INDEX;

module.exports.save = function (ref, data, locals) {
  cuneiformCmpt.save(ref, data, locals);
  data.cuneiformQuery.index = data.elasticIndex || DEFAULT_ELASTIC_INDEX;
  return data;
};

module.exports.render = cuneiformCmpt.render;

}).call(this,require(22))}, {"22":22,"95":95}];
