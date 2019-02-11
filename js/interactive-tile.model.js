window.modules["interactive-tile.model"] = [function(require,module,exports){'use strict';

module.exports.render = function (ref, data) {
  data.id = ref.split('/').slice(-1)[0];
  return data;
};
}, {}];
