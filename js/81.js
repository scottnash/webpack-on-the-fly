window.modules["81"] = [function(require,module,exports){(function (process){
'use strict';

var clayLog = require(328),
    _defaults = require(894);

var sitesLogInstance, // Populated after init
navigatorReference;
/**
 * Setup the logger
 *
 * @param  {String} version
 * @param  {Boolean} browser
 */

function init(version, browser) {
  var instanceMeta = {},
      // only initialize Clay logger if we're loading in Edit mode or on the server
  viewMode = typeof window !== 'undefined' && typeof window.process === 'undefined';

  if (viewMode) {
    sitesLogInstance = null;
  } else {
    if (version) {
      instanceMeta.sitesVersion = version;
    }

    if (browser) {
      instanceMeta.browserVersion = navigatorReference.userAgent;
    } // Initialize the logger


    clayLog.init({
      name: 'sites',
      meta: instanceMeta
    });
    sitesLogInstance = clayLog.getLogger();
  }
}
/**
 * Call this function in specific files to get a logging
 * instance specific to that file. Handy for adding
 * the filename or any other file specific meta information
 *
 * @param  {Object} meta
 * @return {Function}
 */


function setup(meta) {
  meta = _defaults({}, meta, {
    file: 'File not specified! Please declare a file'
  });

  if (sitesLogInstance) {
    return clayLog.meta(meta, sitesLogInstance);
  } else {
    return console.log;
  }
} // If we're in the browser, let's call initialize immediately
// and use the global navigator object


if (!(process.versions && process.versions.node)) {
  navigatorReference = navigator;
  init(null, true);
}

module.exports.init = init;
module.exports.setup = setup; // For testing

module.exports.assignNavigator = function (fakeNavigator) {
  navigatorReference = fakeNavigator;
};

module.exports.assignLogInstance = function (fakeInstance) {
  sitesLogInstance = fakeInstance;
};

}).call(this,require(22))}, {"22":22,"328":328,"894":894}];
