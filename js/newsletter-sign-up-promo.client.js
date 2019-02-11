window.modules["newsletter-sign-up-promo.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    newsletter = require(169),
    cmptName = 'newsletter-sign-up-promo';

DS.controller(cmptName, ['$window', function ($window) {
  var successClass = 'success',
      errorClass = 'error',
      ariaHidden = 'aria-hidden';

  function Constructor(el) {
    // dont show this on tablet
    if ($window.innerWidth < 1180 && $window.innerWidth > 768) {
      return;
    }

    this.el = el;
    this.form = dom.find(el, '.form');
    this.count = parseInt($window.localStorage.getItem('theCut-homepage-logins')) || 0;
    this.errorMsg = this.form.getAttribute('data-error-msg');
    this.successMsg = this.form.getAttribute('data-success-msg');
    this.returnMsg = dom.find(el, '.return-message'); // add newsletter behavior

    new newsletter.Newsletter(this.form, this.onSuccess.bind(this), this.onError.bind(this), this.reset.bind(this), cmptName); // if user has signed up already for newsletter or theyve seen it more than 4 times, keep component hidden
    // otherwise show component and hide last article in the list

    if (!$window.localStorage.getItem('theCut-email-signed-up') && this.count <= 4) {
      el.classList.remove('hidden');
      this.lastArticle = dom.find(el.parentElement, 'li.last-item');
      this.lastArticle.classList.add('hidden'); // increment count

      this.count += 1;
      $window.localStorage.setItem('theCut-homepage-logins', this.count.toString());
    }
  }

  ;
  Constructor.prototype = {
    reset: function reset() {
      this.el.classList.remove(errorClass);
      this.el.classList.remove(successClass);
      this.returnMsg.setAttribute(ariaHidden, true);
    },
    onError: function onError(e) {
      this.el.classList.add(errorClass);
      this.returnMsg.setAttribute(ariaHidden, false);
      this.returnMsg.innerHTML = this.errorMsg;
      console.error('error', e);
    },
    onSuccess: function onSuccess() {
      // Set a pixel on successful submit
      if (window.fbq) {
        window.fbq('track', 'Lead');
      }

      this.el.classList.add(successClass);
      this.returnMsg.setAttribute(ariaHidden, false);
      this.returnMsg.innerHTML = this.successMsg;
      this.returnMsg.focus(); // make sure we don't show the signup again

      $window.localStorage.setItem('theCut-email-signed-up', 'true');
      setTimeout(function () {
        this.el.classList.toggle('fade-out');
      }.bind(this), 1500);
      setTimeout(function () {
        this.el.classList.toggle('hidden');
        this.lastArticle.classList.toggle('hidden');
      }.bind(this), 2000);
    }
  };
  return Constructor;
}]);
}, {"1":1,"169":169}];
