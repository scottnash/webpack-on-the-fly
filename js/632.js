window.modules["632"] = [function(require,module,exports){'use strict';

var Type = require(613);

function resolveYamlMerge(data) {
  return data === '<<' || data === null;
}

module.exports = new Type('tag:yaml.org,2002:merge', {
  kind: 'scalar',
  resolve: resolveYamlMerge
});
}, {"613":613}];
