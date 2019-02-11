window.modules["newsletter-flex-text.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _kebabCase = require(70),
    _set = require(87),
    cmptName = 'newsletter-flex-text';

DS.controller(cmptName, ['$window', function ($window) {
  var errorMsgDefault = 'Please enter a valid email address',
      successMsgDefault = 'Thank you for signing up!',
      failedMsg = 'An error occurred. Please try again.',
      localStorageKeyName = 'signUpColumnStatus',
      sessionStorageKeyName = 'signUpColumn';

  function Constructor(el) {
    this.el = el;
    this.email = dom.find(el, '.email');
    this.source = dom.find(el, '.source');
    this.form = dom.find(el, '.form');
    this.returnMsg = dom.find(el, '.return-message');
    this.newsletterId = dom.find(el, '.newsletterId').value;
    this.local = $window.localStorage;
    this.session = $window.sessionStorage; // check to see if this localStorageKeyName with newsletterId already exists
    // if not, display the component and fire tracking

    this.displayComponent();
  }

  Constructor.prototype = {
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
    displayComponent: function displayComponent() {
      // initially not display
      var storageKey = Object.keys(this.local),
          self = this,
          promoKey = [],
          i;

      for (i = 0; i < storageKey.length; i++) {
        if (storageKey[i].indexOf(localStorageKeyName + this.newsletterId.toString()) > -1) {
          promoKey.push(storageKey[i]);
        }
      }

      if (promoKey.length === 0) {
        // component is `display:none` at page render
        this.el.classList.remove('initially-hidden');
        this.form.classList.remove('initially-hidden'); // fade in the component's opacity after a second

        setTimeout(function () {
          self.el.classList.remove('opacity-zero');
        }, 100);

        if (this.session) {
          try {
            this.session.setItem(sessionStorageKeyName, 'displayed');
          } catch (e) {// the browser failed to setItem, likely due to Private Browsing mode. We don't need to take any action
          }
        }
      } else {
        self.el.parentElement.classList.add('newsletter-collapsed');
      }

      $window.addEventListener('unload', function () {
        self.session.removeItem(sessionStorageKeyName);
      });
    },
    events: {
      '.form submit': 'submitForm',
      '.email keypress': 'clearMsg'
    },
    clearMsg: function clearMsg() {
      this.returnMsg.innerHTML = '';
    },
    submitForm: function submitForm(e) {
      var request = new XMLHttpRequest(),
          errorMsg = this.form.getAttribute('data-error-msg'); // first check if valid email address

      if (this.email.value.search(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i) < 0) {
        // check if error message is empty
        if (!errorMsg || errorMsg === '') {
          errorMsg = errorMsgDefault;
        }

        this.returnMsg.innerHTML = errorMsg;
        this.returnMsg.focus();
        e.preventDefault();
      } else {
        dom.preventDefault(e);
        request.open('POST', this.getRequestUrl(), true);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.addEventListener('load', this.onRequest.bind(this));
        request.addEventListener('error', this.onError.bind(this));
        request.send(JSON.stringify(this.getPayloadObject()));
        e.preventDefault();
      }
    },
    // on a request completing
    onRequest: function onRequest(e) {
      var status = (e.currentTarget || e.target).status;

      if (status >= 200 && status < 300) {
        this.onSuccess();
      } else {
        this.onError(e);
      }
    },
    // On an unsuccessful subscription
    onError: function onError() {
      this.returnMsg.classList.add('error');
      this.returnMsg.innerHTML = failedMsg;
      this.returnMsg.focus();
    },
    // On a successful subscription
    onSuccess: function onSuccess() {
      var self = this,
          successMsg = this.form.getAttribute('data-success-msg');

      if (!successMsg || successMsg === '') {
        successMsg = successMsgDefault;
      } // Set a pixel on successful submit


      if (window.fbq) {
        window.fbq('track', 'Lead');
      }

      this.returnMsg.innerHTML = successMsg;
      this.returnMsg.focus();
      this.form.classList.add('success');
      setTimeout(function () {
        self.el.classList.add('opacity-zero');
        setTimeout(function () {
          self.el.classList.add('initially-hidden');
          self.el.parentElement.classList.add('newsletter-collapsed');
        }, 1000);
      }, 5000);

      if (this.local) {
        try {
          this.local.setItem(localStorageKeyName + this.newsletterId.toString(), 'success');
        } catch (e) {// the browser failed to setItem, likely due to Private Browsing mode. We don't need to take any action
        }
      }
    }
  };
  return Constructor;
}]);
}, {"1":1,"70":70,"87":87}];
