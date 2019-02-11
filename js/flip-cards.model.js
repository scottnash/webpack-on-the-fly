window.modules["flip-cards.model"] = [function(require,module,exports){'use strict';

var _find = require(71),
    _require = require(56),
    getComponentName = _require.getComponentName;

module.exports.save = function (ref, data) {
  data.containsShoppable = !!_find(data.flipCardsContent, function (cmpt) {
    return getComponentName(cmpt._ref) === 'flip-card-shoppable';
  });
  return data;
};
}, {"56":56,"71":71}];
