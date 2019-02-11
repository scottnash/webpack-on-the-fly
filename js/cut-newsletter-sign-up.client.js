window.modules["cut-newsletter-sign-up.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _kebabCase = require(70),
    _set = require(87),
    cmptName = 'cut-newsletter-sign-up';

DS.controller(cmptName, [function () {
  var Constructor,
      successClass = 'success',
      errorClass = 'error',
      ariaHidden = 'aria-hidden';
  /**
   * @param {Element} rootEl
   * @returns {string}
   */

  /**
   * @param {Element} el
   * @constructor
   * @property {Element} el
   */

  function Constructor(el) {
    this.el = el;
    this.email = dom.find(el, '.email');
    this.source = dom.find(el, '.source');
    this.form = dom.find(el, '.form');
    this.newsletterId = dom.find(el, '.newsletterID').value;
    /**
     * Error message DOM node
     * @type {Element}
     */

    this.errorMsg = dom.find(el, '.message.error');
    /**
     * Success message DOM node
     * @type {Element}
     */

    this.successMsg = dom.find(el, '.message.success');
  }

  ;
  Constructor.prototype = {
    events: {
      '.form submit': 'submit'
    },

    /**
     * Handles form submission and events
     * @param {Event} e
     */
    submit: function submit(e) {
      var request = new XMLHttpRequest();
      dom.preventDefault(e);
      request.open('POST', this.getRequestUrl(), true);
      request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      request.addEventListener('load', this.onRequest.bind(this));
      request.addEventListener('error', this.onError.bind(this));
      request.send(JSON.stringify(this.getPayloadObject()));
      e.preventDefault();
    },
    getRequestUrl: function getRequestUrl() {
      return this.form.getAttribute('action');
    },
    getPageType: function getPageType() {
      var pageMetaElement = dom.find('meta[name="type"]'),
          pageMetaType = pageMetaElement ? pageMetaElement.getAttribute('content') : '';
      return _kebabCase(pageMetaType);
    },
    getPayloadObject: function getPayloadObject() {
      var payloadObject = {}; // Payload object should match:
      // {
      //   "email":  email of user,
      //   "vars": {
      //      "source_<newsletterId>": <component-name>_<page-type>
      //   },
      //   "lists": {
      //     <LIST ID>: true
      //   }
      // }

      payloadObject.email = this.email.value;

      _set(payloadObject, "vars.source_".concat(this.newsletterId), "".concat(cmptName, "_").concat(this.getPageType()));

      payloadObject.lists = {};
      payloadObject.lists[this.newsletterId] = true;
      return payloadObject;
    },

    /**
     * Resets component to initial data
     */
    reset: function reset() {
      var el = this.el,
          form = dom.find(el, 'form');
      form.reset();
      el.classList.remove(errorClass);
      el.classList.remove(successClass);
      this.errorMsg.setAttribute(ariaHidden, true);
      this.successMsg.setAttribute(ariaHidden, true);
    },

    /**
     * On a request completing
     * @param {Event} e
     */
    onRequest: function onRequest(e) {
      var status = (e.currentTarget || e.target).status;

      if (status >= 200 && status < 300) {
        this.onSuccess();
      } else {
        this.onError(e);
      }
    },

    /**
     * On an unsuccessful subscription
     * @param {Event} e
     */
    onError: function onError(e) {
      this.reset();
      this.el.classList.add(errorClass);
      this.errorMsg.setAttribute(ariaHidden, false);
      this.errorMsg.focus();
      console.error('error', e);
    },

    /**
     * On a successful subscription
     */
    onSuccess: function onSuccess() {
      // Set a pixel on successful submit
      if (window.fbq) {
        window.fbq('track', 'Lead');
      }

      this.reset();
      this.el.classList.add(successClass);
      this.successMsg.setAttribute(ariaHidden, false);
      this.successMsg.focus();
    }
  };
  return Constructor;
}]);
}, {"1":1,"70":70,"87":87}];
