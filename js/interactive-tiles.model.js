window.modules["interactive-tiles.model"] = [function(require,module,exports){'use strict';

module.exports.render = function (ref, data, locals) {
  // In edit mode, replace component list of tile objects into an array of tile ref
  // strings for performance.
  if (locals.edit) {
    data.tiles = data.tiles.map(function (obj) {
      return obj._ref;
    });
  } // If the "tile" query param is given, include the tile object so it can be edited


  if (locals.edit && locals.tile) {
    data.editingTile = {
      _ref: locals.tile
    };
  }

  return data;
};
}, {}];
