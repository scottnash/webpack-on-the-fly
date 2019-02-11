window.modules["4"] = [function(require,module,exports){'use strict';

var rest = require(5),
    isProd = require(6)();

function linkAccount(data) {
  var url = "https://9s00sks0r3.execute-api.us-east-1.amazonaws.com/".concat(isProd ? 'prd' : 'stg', "/link-pcd");
  return rest.post(url, data);
}

module.exports = linkAccount;
}, {"5":5,"6":6}];
