window.modules["66"] = [function(require,module,exports){'use strict';

module.exports = {
  Logger: Logger
};
/**
 * Client side logger which supports styles and custom and suppression logic
 * Useful for logging data in one environment but not another or
 * maintaining multiple logs in different contexts
 * ex: 
 *   const logger = Logger(() => !isProduction)
 *   logger.h1('this is a headline')
 * @param {function} shouldOutput - return true/false
 * @return {object}
 */

function Logger() {
  var shouldOutput = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {
    return true;
  };

  var _shouldOutput = shouldOutput(),
      styles = {
    h1: "font-size: 15px; font-weight: bold; font-family: \n      sans-serif; margin: 1em 0 0.25em; border-bottom: 1px dotted black; padding-right: 100px",
    h2: 'font-size: 13px; font-weight: bold; margin-top: 1em'
  };

  return {
    log: function log() {
      var _console;

      _shouldOutput && (_console = console).log.apply(_console, arguments);
    },
    table: function table() {
      var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      _shouldOutput && console.table(msg);
    },
    error: function error(err) {
      _shouldOutput && console.error(err);
    },
    group: function group() {
      _shouldOutput && console.group();
    },
    groupEnd: function groupEnd() {
      _shouldOutput && console.groupEnd();
    },
    styled: function styled() {
      var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var style = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      _shouldOutput && console.log("%c ".concat(msg), style);
    },
    h1: function h1() {
      var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      this.styled(msg, styles['h1']);
    },
    h2: function h2() {
      var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      this.styled(msg, styles['h2']);
    }
  };
}
}, {}];
