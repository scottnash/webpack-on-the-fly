window.modules["633"] = [function(require,module,exports){'use strict';

var Type = require(613);

module.exports = new Type('tag:yaml.org,2002:str', {
  kind: 'scalar',
  construct: function (data) { return data !== null ? data : ''; }
});
}, {"613":613}];
