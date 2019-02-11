window.modules["88"] = [function(require,module,exports){'use strict';

var _isString = require(164),
    _set = require(87),
    _each = require(213),
    _isObject = require(74),
    _assign = require(57),
    _isUndefined = require(903),
    _get = require(32);
/**
 * If options is a string, then create options object for a GET
 * @param {object|string} options
 * @returns {object}
 */


function stringToOptions(options) {
  return _isString(options) ? {
    method: 'GET',
    url: options
  } : options;
}
/**
 *
 * @param {number} [status]
 * @param {object} [err]
 * @returns {object}
 */


function errorWithStatus(status, err) {
  return _set(err || {}, 'status', status);
}
/**
 * @callback errorXhrCallback
 * @param {object} error
 * @param {number} [error.status]
 * @param {XMLHttpRequest} xhr
 */

/**
 * Send an AJAX request.
 * @param {object|string} options        if string, performs a GET
 * @param {object} [options.headers]
 * @param {object|string} [options.data]
 * @param {errorXhrCallback} callback (see definition above in `@callback errorXhrCallback`)
 */


function send(options, callback) {
  var xhr = new XMLHttpRequest();
  options = stringToOptions(options);
  xhr.open(options.method, options.url, true); // always async

  _each(options.headers, function (value, key) {
    xhr.setRequestHeader(key, value);
  });

  if (_isObject(options.data)) {
    options.data = JSON.stringify(options.data);
  }

  xhr.addEventListener('load', function () {
    var error = xhr.readyState === 4 && xhr.status < 400 ? null : errorWithStatus(xhr.status);
    callback(error, xhr);
  }, false);
  xhr.addEventListener('error', function (e) {
    callback(errorWithStatus(xhr.status, e), xhr);
  }, false);
  xhr.addEventListener('abort', function (e) {
    callback(errorWithStatus(xhr.status, e), xhr);
  }, false);
  xhr.send(options.data);
}
/**
 * @param {object} obj
 * @returns {object}
 */


function addJsonHeader(obj) {
  _assign(obj, {
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });

  return obj;
}
/**
 * Always returns an object even if the str is not valid JSON.
 * @param {string} str
 * @returns {object}
 */


function tryJsonParse(str) {
  var obj;

  try {
    obj = JSON.parse(str);
  } catch (e) {
    obj = {};
  }

  return obj;
}
/**
 *
 * @param {XMLHttpRequest} xhr
 * @returns {{}|undefined}
 */


function parseResponse(xhr) {
  var json;

  if (!_isUndefined(xhr)) {
    json = tryJsonParse(_get(xhr, 'response'));
  }

  return json;
}
/**
 * Convenience method that adds JSON header to request.
 * @param {object} options
 * @param {errorXhrCallback} callback (see definition above in `@callback errorXhrCallback`)
 */


function sendJson(options, callback) {
  send(addJsonHeader(stringToOptions(options)), callback);
}
/**
 * @callback errorResponseXhrCallback
 * @param {object} error
 * @param {number} [error.status]
 * @param {object} responseData
 * @param {XMLHttpRequest} xhr
 */

/**
 * @param {errorResponseXhrCallback} callback (see definition above in `@callback errorResponseXhrCallback`)
 * @returns {function}
 */


function callbackParsed(callback) {
  return function (err, xhr) {
    callback(err, parseResponse(xhr), xhr); // Note that we are still passing the full xhr as a third argument
  };
}
/**
 * Convenience method that parses JSON response.
 * @param {object} options
 * @param {errorResponseXhrCallback} callback (see definition above in `@callback errorResponseXhrCallback`)
 */


function sendReceiveJson(options, callback) {
  send(options, callbackParsed(callback));
}
/**
 * Convenience method that adds JSON header request and parses JSON response.
 * @param {object} options
 * @param {errorResponseXhrCallback} callback (see definition above in `@callback errorResponseXhrCallback`)
 */


function sendJsonReceiveJson(options, callback) {
  sendJson(options, callbackParsed(callback));
} // public methods.


module.exports.send = send; // Callback is `errorXhrCallback`.

module.exports.sendJson = sendJson; // convenience: adds JSON header only. Callback is `errorXhrCallback`.

module.exports.sendReceiveJson = sendReceiveJson; // convenience: parses response only. Callback is  `errorResponseXhrCallback`.

module.exports.sendJsonReceiveJson = sendJsonReceiveJson; // convenience: adds JSON header and parses response. Callback is `errorResponseXhrCallback`.
// Exposed for testing

module.exports.addJsonHeader = addJsonHeader;
module.exports.errorWithStatus = errorWithStatus;
module.exports.stringToOptions = stringToOptions;
module.exports.tryJsonParse = tryJsonParse;
module.exports.parseResponse = parseResponse;
module.exports.callbackParsed = callbackParsed;
}, {"32":32,"57":57,"74":74,"87":87,"164":164,"213":213,"903":903}];
