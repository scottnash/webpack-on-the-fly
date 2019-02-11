window.modules["641"] = [function(require,module,exports){(function (process,global){
'use strict';

var request = require(272),
  vm = require(258),
  fs = require(312),
  parensRegex = /(^\(|\);?\s*$)/,
  functionRegex = /^[a-z\d_]*\(/i,
  functionNameRegex = /([\w\d_]*)\(/,
  evalJsonp,
  parseJsonp,
  evalOrParseJavascript,
  fetchRemoteJsonp,
  fetchUrl,
  fetchLocalJsonp,
  enableLocalFileSupport =
    window.process.env.NODE_ENV === 'test' ||
    window.process.env.JSONP_CLIENT_ENABLE_LOCAL_SUPPORT;

// Allow mocking superagent requests on test environments
if (window.process.env.NODE_ENV === 'test' && window.process.env.SUPERAGENT_MOCK) {
  var mockConfig = global.superAgentMockConfig ||
    require(window.process.env.SUPERAGENT_MOCK);
  require(272)(request, mockConfig);
}

// Lazy JSONp extraction by JSON.parsing the callback argument
parseJsonp = function (javascript, callback) {
  var err = null,
    jsonString, json;
  try {
    // chomp off anything that looks like a function name, remove parenthesis
    jsonString = javascript.replace(functionRegex, '').replace(parensRegex, '');
    json = JSON.parse(jsonString);
  } catch (error) {
    err = error;
  }
  callback(err, json);
};

// Creates a JavaScript VM in order to evaluate
// javascript from jsonp calls. This is expensive
// so make sure you cache the results
evalJsonp = function (javascript, cb) {
  var context, jsonp_callback_name, code;
  javascript = (javascript || '') + '';

  context = vm.createContext({
    error: null,
    cbData: null
  });

  jsonp_callback_name =
    (javascript.match(functionNameRegex) || [null, false])[1];

  code = 'function ' + jsonp_callback_name + ' (data) { cbData = data } ' +
         ' try { ' + javascript + ' } catch(e) { error = e;} ';

  try {
    vm.runInContext(code, context);
  } catch (e) {
    cb(new Error(e));
  }

  if (context.error) { return cb(new Error(context.error)); }
  cb(null, context.cbData);
};

// Given a javascript buffer this method will attempt
// to parse it as a string or it will attempt to run it
// on a vm
evalOrParseJavascript = function (javascript, callback) {
  javascript = javascript.toString();
  parseJsonp(javascript, function (err, json) {
    if (err) {
      return evalJsonp(javascript, function (err, json) {
        callback(err, json);
      });
    }
    callback(err, json);
  });
};



// Fetches a URL and returns a buffer with the response
fetchUrl = function (url_to_fetch, callback) {
  request
    .get(url_to_fetch)
    .buffer(true)
    .accept('application/javascript')
    .parse(function (res, fn) {
      res.text = '';
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        res.text = res.text + chunk;
      });
      res.on('end', fn);
    })
    .end(function (err, res) {

      if (!err && res && res.status && res.status >= 400) {
        err = new Error(
          'Could not fetch url ' +
          url_to_fetch +
          ', with status ' +
          ((res && res.status) || 'unknown') +
          '. Got error: ' +
          (err && err.message) + '.'
        );
      }
      callback(err, (res && res.text) || 'cb({})');
    });
};

// Fetches a jsonp response from a remote service
// Make sure you cache the responses as this process
// creates a JavaScript VM to safely evaluate the javascript
fetchRemoteJsonp = function (remote_url, callback) {
  fetchUrl(remote_url, function (err, body) {
    if (err) {
      return callback(err);
    }

    evalOrParseJavascript(body, callback);
  });
};

// Retrieves a local file and evaluates the JSON script on a JS VM
// this is only available for when NODE_ENV is set to 'test'
fetchLocalJsonp = enableLocalFileSupport ?
  function (file_path, callback) {
    file_path = file_path.split('?')[0];
    fs.readFile(file_path, function (err, jsonp) {
      if (err) { return callback(err); }
      evalOrParseJavascript(jsonp, callback);
    });
  } :
  fetchRemoteJsonp;

module.exports = function (jsonp_path_or_url, callback) {
  if (jsonp_path_or_url.match(/^http/)) {
    fetchRemoteJsonp(jsonp_path_or_url, callback);
  } else {
    fetchLocalJsonp(jsonp_path_or_url, callback);
  }
};

}).call(this,require(22),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})}, {"22":22,"258":258,"272":272,"312":312}];
