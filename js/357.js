window.modules["357"] = [function(require,module,exports){var nextTick = require(360)
var isNil = require(358)
var once = require(316)
var optionalArgs = require(359)

var wrap = function (wrapper, fn) {
  return function () {
    var args = arguments
    return wrapper(function () {
      return fn.apply(undefined, args)
    })
  }
}

var ensureAsync = function (fn) {
  return wrap(nextTick, fn)
}

/*var ensureAsync = function (fn) {
  return function () {
    var args = arguments
    return nextTick(function () {
      return fn.apply(undefined, args)
    })
  }
}*/

var defaults = {
  ignoreErrors: false
}

var cleanup = function (completed, cleanupFns) {
  nextTick(function() {
    cleanupFns.filter(function (fn, idx) {
      return completed.indexOf(idx) === -1
    }).forEach(function (fn) {
      typeof fn === 'function' && fn()
    })
  })
}

var concurrent = function (functions, options, finalCb) {
  options = options || {}
  var ignoreErrors = isNil(options.ignoreErrors) ? defaults.ignoreErrors : options.ignoreErrors
  var completed = []
  var results = []
  var errors = []
  var hasErr = false // useful to avoid examining the errors array
  var cleanupFns = functions.map(function (fn, idx) {
    var fnCb = function (err, result) {
      completed.push(idx)
      errors[idx] = err
      results[idx] = result
      if (!hasErr && !isNil(err)) {
        hasErr = true
        if (ignoreErrors === false) {
          cleanup(completed, cleanupFns)
        }
      }
      if (completed.length === functions.length) {
        var errResults = options.ignoreErrors ? results : undefined
        hasErr ? finalCb(errors, errResults) : finalCb(undefined, results)
      }
    }
    var preparedCb = once(ensureAsync(fnCb))
    var cleanupFn = fn(preparedCb)
    return cleanupFn
  })
}

module.exports = optionalArgs(1, 3, concurrent)
}, {"316":316,"358":358,"359":359,"360":360}];
