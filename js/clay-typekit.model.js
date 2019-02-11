window.modules["clay-typekit.model"] = [function(require,module,exports){'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var TYPEKIT_KIT_ID_REGEX = /\/(\w+).js/;

module.exports.render = function (uri, data) {
  var kitSrc = data.kitSrc,
      _ref = TYPEKIT_KIT_ID_REGEX.exec(kitSrc || '') || [null, null],
      _ref2 = _slicedToArray(_ref, 2),
      kitId = _ref2[1];

  if (kitId) {
    data.kitId = kitId;
  }

  return data;
};
}, {}];
