window.modules["newsletter-slideout.client"] = [function(require,module,exports){'use strict';

var _set = require(87),
    _kebabCase = require(70),
    _throttle = require(23),
    dom = require(1),
    cmptName = 'newsletter-slideout';

DS.controller(cmptName, ['$window', '$document', function ($window, $document) {
  var localStorageKeyRoot = 'newsletter-slideout-';

  function Constructor(el) {
    this.el = el;
    this.modal = dom.find(this.el, '.modal');
    this.signUpView = dom.find(this.modal, '.sign-up-view');
    this.successView = dom.find(this.modal, '.success-view');
    this.form = dom.find(this.signUpView, '.cta');
    this.email = dom.find(this.form, '.email');
    this.source = dom.find(this.form, '.source');
    this.errorMessage = dom.find(this.form, '.error-message');
    this.newsletterId = dom.find(this.form, '.newsletterId').value;
    this.local = $window.localStorage;
    this.localStorageKey = localStorageKeyRoot + this.newsletterId;

    if (!this.newsletterId) {
      // If we don't have a newsletter ID, there's no point in showing the modal in the first place
      // This shouldn't happen since newsletter ID is required in the schema but ya never know
      return;
    }

    this.getLocalStorageData();

    if (this.localStorageData.signedUp) {
      // The user has already signed up for this newsletter, we shouldn't display the modal
      return;
    }

    if (this.shouldShowModal()) {
      delete this.localStorageData.dismissed;
      delete this.localStorageData.paused;
      this.createModalVisibilityTrigger();
    }

    if (this.localStorageData.dismissed) {
      this.localStorageData.paused += 1;
    }

    this.localStorageData.last = Date.now().toString();
    this.saveLocalStorageData();
  }

  Constructor.prototype = {
    events: {
      '.dismiss-modal click': 'dismissModal',
      '.cta submit': 'submitForm',
      '.email keypress': 'clearError'
    },
    getLocalStorageData: function getLocalStorageData() {
      try {
        this.localStorageData = JSON.parse(this.local.getItem(this.localStorageKey)) || {};
      } catch (error) {
        // unable to access local storage, some browsers do not make this available in private browsing mode
        this.localStorageData = {};
      }
    },
    saveLocalStorageData: function saveLocalStorageData() {
      try {
        this.local.setItem(this.localStorageKey, JSON.stringify(this.localStorageData));
      } catch (error) {// unable to access local storage, some browsers do not make this available in private browsing mode
      }
    },
    shouldShowModal: function shouldShowModal() {
      var firstTimeVisitor = typeof this.localStorageData.last === 'undefined',
          repeatVisitor = !firstTimeVisitor,
          repeatVisitorVisibility = this.el.getAttribute('data-repeat-visitor-visibility'),
          pauseDuration = parseInt(this.el.getAttribute('data-pause-duration')),
          showAgainAfterDismissal = this.el.getAttribute('data-show-again-after-dismissal') == 'true';

      if (firstTimeVisitor && repeatVisitorVisibility == 'onlyRepeat') {
        // if user is a first time visitor, and we only show to repeats, don't show
        return false;
      } else if (repeatVisitor && repeatVisitorVisibility == 'onlyFirstTime') {
        // if user is a repeat time visitor, and we only show to first timers, don't show
        return false;
      } else if (!showAgainAfterDismissal && this.localStorageData.dismissed) {
        // if we aren't showing the modal after dismissal, and the visitor has dismissed, don't show
        return false;
      } else if (pauseDuration && this.localStorageData.paused !== 'undefined' && this.localStorageData.paused < pauseDuration) {
        // if we have set the pause duration, but the user has not visited that number of times yet, don't show
        return false;
      }

      return true;
    },
    createModalVisibilityTrigger: function createModalVisibilityTrigger() {
      var depthPercentageToDisplay = this.el.getAttribute('data-display-at-page-scroll-percentage') || 0,
          currentDepthPercentage = $window.scrollY / ($document.body.offsetHeight - $window.innerHeight) * 100,
          onModalScroll = _throttle(function () {
        var scrollDepthPercentage = $window.scrollY / ($document.body.offsetHeight - $window.innerHeight) * 100;

        if (scrollDepthPercentage >= depthPercentageToDisplay) {
          this.showModal();
          $document.removeEventListener('scroll', onModalScroll);
        }
      }, 200).bind(this);

      if (!depthPercentageToDisplay || currentDepthPercentage > depthPercentageToDisplay) {
        // Show the modal immediately
        this.showModal();
      } else {
        // Create a scroll listener to show the modal when the user scrolls to depthPercentageToDisplay% down the page
        $document.addEventListener('scroll', onModalScroll);
      }
    },
    showModal: function showModal() {
      this.signUpView.classList.remove('hidden');
      this.successView.classList.add('hidden');
      this.modal.classList.remove('hidden');
    },
    clearError: function clearError() {
      this.errorMessage.classList.add('hidden');
      this.email.classList.remove('error');
    },
    submitForm: function submitForm(e) {
      var request = new XMLHttpRequest();
      e.preventDefault(); // first check if valid email address

      if (this.email.value.search(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/i) < 0) {
        this.onEmailError();
      } else {
        dom.preventDefault(e);
        request.open('POST', this.getRequestUrl(), true);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.addEventListener('load', this.onRequest.bind(this));
        request.addEventListener('error', this.onConnectionError.bind(this));
        request.send(JSON.stringify(this.getPayloadObject()));
      }

      return false;
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
    // on a request completing
    onRequest: function onRequest(e) {
      var status = (e.currentTarget || e.target).status;

      if (status >= 200 && status < 300) {
        this.onSuccess();
      } else {
        this.onConnectionError(e);
      }
    },
    onEmailError: function onEmailError() {
      this.errorMessage.innerHTML = '*Please enter a valid email';
      this.displayError();
    },
    onConnectionError: function onConnectionError() {
      this.errorMessage.innerHTML = '*Sorry, there was a problem signing you up.';
      this.displayError();
    },
    // On an unsuccessful subscription
    displayError: function displayError() {
      this.errorMessage.classList.remove('hidden');
      this.email.classList.add('error');
      this.errorMessage.focus();
    },
    // On a successful subscription
    onSuccess: function onSuccess() {
      if (window.fbq) {
        window.fbq('track', 'Lead');
      }

      this.signUpView.classList.add('hidden');
      this.successView.classList.remove('hidden');
      this.localStorageData.signedUp = Date.now().toString();
      this.saveLocalStorageData();
      setTimeout(this.hideModal.bind(this), 3000);
    },
    dismissModal: function dismissModal() {
      this.localStorageData.dismissed = Date.now().toString();
      this.localStorageData.paused = 0;
      this.saveLocalStorageData();
      this.hideModal();
    },
    hideModal: function hideModal() {
      this.modal.classList.add('hidden');
    }
  };
  return Constructor;
}]);
}, {"1":1,"23":23,"70":70,"87":87}];
