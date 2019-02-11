window.modules["30"] = [function(require,module,exports){'use strict';
/**
 * Any click handler on the document level should use this service.
 * Listening on the document level gets all clicks as they bubble up,
 * unless e.stopPropagation() was called.
 *
 * This service allows us to add click handlers that are triggered
 * just prior to the click event via touchstart or mousedown when possible,
 * which gives us about 20ms.
 *
 * This service can ensure one function is run after all others on click,
 * which is useful in the use-case of redirecting links for tracking.
 *
 * TODO: frequently handlers might call something like `dom.closest(e.target, 'a')`, which can be expensive,
 *       so we could call that once in globalClick and pass the closest anchor to the handlers
 */

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $window = window,
    $document = document;

var service = function service() {
  _classCallCheck(this, service);

  var handlers = [],
      tearDownHandlers = [],
      finalHandler,
      finalTearDownHandler,
      // store the latest event target to avoid running multiple times on same click as we listen on `touchstart`, `mousedown`, and `click`
  targetStore = Object.create({
    _el: null,
    _to: null,
    _ttl: 300,
    // only store the el for a brief moment in case it is clicked again
    _reset: function _reset() {
      // run tear down so that link looks normal on hover after click
      runTearDownHandlers({
        target: this._el
      }); // todo: if script is slow, we could remove this line

      this._el = null;
    }
  }, {
    latest: {
      /**
       * @returns {Element|null} the last element clicked on (within ttl)
       */
      get: function get() {
        return this._el;
      },

      /**
      * sets the latest, which expires after ttl
      * @param {Element} el
      */
      set: function set(el) {
        $window.clearTimeout(this._to);
        this._el = el;
        this._to = $window.setTimeout(this._reset.bind(this), this._ttl);
      }
    }
  });
  /**
  * runs the handlers for the event if they have not already been for this target
  * @param {Event} e
  */

  function runHandlers(e) {
    var target = e.target,
        handlersLength = handlers.length,
        i;

    if (targetStore.latest !== target) {
      for (i = 0; i < handlersLength; i++) {
        handlers[i].call(null, e);
      }

      if (finalHandler) {
        finalHandler.call(null, e);
      }

      targetStore.latest = target; // set after the handlers in case the handlers are slow
    }
  }
  /**
  * if the context menu is opened, we can "undo" changes to the url
  * @param {Event} e
  */


  function runTearDownHandlers(e) {
    var i;

    if (finalTearDownHandler) {
      finalTearDownHandler.call(null, e);
    } // tear down in reverse order


    for (i = tearDownHandlers.length - 1; i > -1; i--) {
      if (tearDownHandlers[i]) {
        tearDownHandlers[i].call(null, e);
      }
    }
  }
  /**
  * handler will be run prior to a click on an anchor
  * @param {Function} [fn]           synchronous function
  * @param {Function} [tearDownFn]   function to reverse any effects of fn, run on `contextmenu` event
  * @returns {number}                index of the handler can be used for removal
  */


  function addHandler(fn, tearDownFn) {
    var handlerIndex = typeof fn === 'function' ? handlers.push(fn) - 1 : -1;

    if (handlerIndex > -1 && typeof tearDownFn === 'function') {
      tearDownHandlers[handlerIndex] = tearDownFn;
    }

    return handlerIndex;
  }
  /**
  * removes the handler
  * @param {number} [index]
  * @returns {boolean}
  */


  function removeHandler(index) {
    var isHandlerRemoved = !!(typeof index === 'number' && handlers.splice(index, 1));

    if (isHandlerRemoved) {
      tearDownHandlers.splice(index, 1);
    }

    return isHandlerRemoved;
  }
  /**
  * handler will be run after other handlers;
  * this should be reserved for a redirect
  * @param {Function} fn             synchronous function
  * @param {Function} [tearDownFn]   function to reverse any effects of fn, run on `contextmenu` event
  */


  function setFinalHandler(fn, tearDownFn) {
    if (finalHandler) {
      throw new Error('a final handler already exists; use `addHandler` to add a new handler or `unsetFinalHandler` to remove the current final handler.');
    }

    finalHandler = fn;
    finalTearDownHandler = tearDownFn;
  }
  /**
  * in the uncommon case of wanting to remove the final handler
  */


  function unsetFinalHandler() {
    finalHandler = null;
    finalTearDownHandler = null;
  }
  /**
  * adds event listeners to catch all click actions early and always
  */


  function addGlobalListeners() {
    // attempt to get a head-start on `click`
    $document.body.addEventListener('touchstart', runHandlers);
    $document.body.addEventListener('mousedown', runHandlers); // we can always rely on `click` if the above are not triggered

    $document.body.addEventListener('click', runHandlers); // we want the normal url in the context menu

    $document.body.addEventListener('contextmenu', runTearDownHandlers);
  }

  addGlobalListeners();
  this.addHandler = addHandler;
  this.removeHandler = removeHandler;
  this.setFinalHandler = setFinalHandler;
  this.unsetFinalHandler = unsetFinalHandler;
};

module.exports = new service();
}, {}];
