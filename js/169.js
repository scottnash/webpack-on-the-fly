window.modules["169"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _set = require(32),
    _kebabCase = require(70);
/* eslint-disable max-params */


var Newsletter = function Newsletter(form, onSuccess, onError, onReset, cmptName) {
  this.cmptName = cmptName;
  this.form = form;
  this.onSuccess = onSuccess;
  this.onError = onError;
  this.onReset = onReset;
  this.submitBtn = dom.find(this.form, '.submit');
  this.newsletterId = dom.find(this.form, '.newsletter-id').value;
  this.emailField = dom.find(this.form, '.email');
  this.form.addEventListener('submit', this.submit.bind(this));
};
/* eslint-enable */


Newsletter.prototype = {
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

    payloadObject.email = this.emailField.value;

    _set(payloadObject, "vars.source_".concat(this.newsletterId), "".concat(this.cmptName, "_").concat(this.getPageType()));

    payloadObject.lists = {};
    payloadObject.lists[this.newsletterId] = true;
    return payloadObject;
  },
  reset: function reset() {
    this.form.reset();

    if (this.onReset) {
      this.onReset();
    }
  },
  onRequest: function onRequest(e) {
    var status = (e.currentTarget || e.target).status;
    this.reset();

    if (status >= 200 && status < 300) {
      this.onSuccess();
    } else {
      this.onError(e);
    }
  }
};
module.exports.Newsletter = Newsletter;
}, {"1":1,"32":32,"70":70}];
