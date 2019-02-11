window.modules["6"] = [function(require,module,exports){'use strict'; // single function library that determines if you're on production or not

module.exports = function () {
  var hostname = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.hostname;
  var notProdEnv = ['qa.', 'beta.', 'localhost', '.aws.'];
  return !notProdEnv.find(function (env) {
    return hostname.includes(env);
  });
};
}, {}];
