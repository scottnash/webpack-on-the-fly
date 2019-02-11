window.modules["138"] = [function(require,module,exports){'use strict';

module.exports = function (state) {
  return {
    filterTopic: function filterTopic(topic) {
      state.change('openedTile', false);
      state.change('filter', topic);
      state.change('shownTiles', state.tileData.filter(function (tile) {
        return topic === 'all' || tile.topics.indexOf(topic) > -1;
      }).map(function (tile) {
        return tile.id;
      }));
    },
    closeTile: function closeTile() {
      state.change('openedTile', false);
    },
    openTile: function openTile(tileId) {
      state.change('openedTile', tileId);
    },
    nextTile: function nextTile() {
      var currentTileIndex = state.shownTiles.indexOf(state.openedTile);

      if (currentTileIndex < state.shownTiles.length - 1) {
        state.change('openedTile', state.shownTiles[currentTileIndex + 1]);
      }
    },
    prevTile: function prevTile() {
      var currentTileIndex = state.shownTiles.indexOf(state.openedTile);

      if (currentTileIndex > 0) {
        state.change('openedTile', state.shownTiles[currentTileIndex - 1]);
      }
    },
    openRandomTile: function openRandomTile() {
      var eligibleIds = state.shownTiles.reduce(function (prev, curr, index) {
        if (index !== state) {
          prev.push(curr);
        }

        return prev;
      }, []),
          randomId = eligibleIds[Math.floor(Math.random() * eligibleIds.length)];
      state.change('openedTile', randomId);
    },
    openTileByAbsoluteId: function openTileByAbsoluteId(id) {
      var tile = state.tileData.find(function (tile) {
        return tile.absoluteId === id;
      }),
          tileIndex = state.tileData.indexOf(tile);

      if (tileIndex > -1) {
        state.change('openedTile', tileIndex);
      }
    }
  };
};
}, {}];
