window.modules["package-navigation.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _debounce = require(107);

DS.controller('package-navigation', [function () {
  function Constructor(el) {
    this.el = el;
    this.fixedContainer = dom.find(el, '.package-navigation-container');
    this.scrollingContainer = dom.find(el, '.package-navigation-articles');
    this.articles = dom.findAll(el, '.package-navigation-article');
    this.prevBtn = dom.find(el, '.package-navigation-previous');
    this.nextBtn = dom.find(el, '.package-navigation-next');
    this.currentArticle = 0;
    this.scrollBy = 3;
    this.newsletterSlideout = dom.find('.newsletter-slideout .modal');
    this.scrollPos = 0;

    if (this.articles) {
      if (window.innerWidth >= 768) {
        // add fixed class on scroll
        window.addEventListener('scroll', _debounce(function () {
          // when scrolling up, show the package nav
          if (document.body.getBoundingClientRect().top > this.scrollPos) {
            // if the newsletter slideout is visible, hide it before showing the package nav
            if (this.newsletterSlideout && this.newsletterSlideout.classList.contains('modal-up')) {
              this.hideNewsletterSlideOut();
              setTimeout(function () {
                this.packageNavFixed();
                this.newsletterSlideout.classList.remove('modal-up');
              }.bind(this), 800);
            } else {
              // the newsletter slideout is not visible so just show the package nav
              // delay by half second
              setTimeout(function () {
                this.packageNavFixed();
              }.bind(this), 500);
            }
          } else {
            // we're scrolling down, so hide the package nav
            // delay by half second
            setTimeout(function () {
              this.packageNavVisible();
              this.packageNavNotFixed();
            }.bind(this), 500); // if the newsletter slideout is up on the way down, add a class

            if (this.newsletterSlideout && !this.newsletterSlideout.classList.contains('hidden')) {
              this.newsletterSlideout.classList.add('modal-up');
            }
          } // saves the new position for iteration


          this.scrollPos = document.body.getBoundingClientRect().top;
        }.bind(this), 50, {
          leading: true
        }));
      }
    }
  }

  Constructor.prototype = {
    events: {
      '.package-navigation-button click': 'scroll',
      '.package-navigation-next keydown': 'nextKeypress',
      '.package-navigation-previous keydown': 'prevKeypress',
      '.package-navigation-article a keydown': 'articleKeypress'
    },
    packageNavNotFixed: function packageNavNotFixed() {
      this.el.classList.remove('package-navigation-fixed');
    },
    packageNavFixed: function packageNavFixed() {
      this.el.classList.add('package-navigation-fixed');
    },
    packageNavVisible: function packageNavVisible() {
      // if the hide-on-page-load class is not present,
      // add a class that indicates that the package nav should be visible
      if (!this.el.classList.contains('hide-on-page-load')) {
        this.el.classList.add('package-navigation-visible');
      } else {
        this.el.classList.remove('package-navigation-visible');
      }
    },
    hideNewsletterSlideOut: function hideNewsletterSlideOut() {
      // if the newsletter modal is shown and then we start scrolling up, hide the modal so that it doesn't show on this page again
      this.newsletterSlideout.classList.add('hidden');
    },
    scroll: function scroll(e) {
      var dir = e.target.getAttribute('data-direction') || 1,
          articleLeft; // tabbing can shift the scroll pos of the container - reset it here

      this.fixedContainer.scrollLeft = 0; // find the article we want to shift to

      this.currentArticle = this.currentArticle + this.scrollBy * dir;
      this.currentArticle = Math.max(this.currentArticle, 0);
      this.currentArticle = Math.min(this.currentArticle, this.articles.length - 1); // get the left border of the article we're shifting to and go!

      articleLeft = this.articles[this.currentArticle].offsetLeft;

      if (articleLeft !== 0) {
        articleLeft = articleLeft * -1 - 1; // adjust for left borders
      }

      this.scrollingContainer.setAttribute('style', 'transform: translateX(' + articleLeft + 'px)'); // set buttons

      this.prevBtn.disabled = this.currentArticle === 0;
      this.nextBtn.disabled = this.currentArticle === this.articles.length - 1; // If we're at the last article, focus on it. This prevents focus jumping
      // back to the beginning when the next button becomes disabled.

      if (this.currentArticle === this.articles.length - 1) {
        dom.find(this.articles[this.currentArticle], 'a').focus();
      }
    },
    nextKeypress: function nextKeypress(e) {
      if (e.key === 'Tab' && !e.shiftKey) {
        // If we're tabbing off the "next" button (without shift held down),
        // we're entering the article list. We want to enter at the current point,
        // not the beginning.
        e.preventDefault();
        dom.find(this.articles[this.currentArticle], 'a').focus();
      }
    },
    prevKeypress: function prevKeypress(e) {
      if (e.key === 'Tab' && !e.shiftKey && this.nextBtn.disabled) {
        // If we're tabbing off the "prev" button (without shift held down) while
        // the "next" button is disabled, we're entering the article list as above.
        e.preventDefault();
        dom.find(this.articles[this.currentArticle], 'a').focus();
      }
    },
    articleKeypress: function articleKeypress(e) {
      var articleIndex = parseInt(e.target.parentNode.getAttribute('data-index'), 10);

      if (articleIndex === this.currentArticle && e.key === 'Tab' && e.shiftKey) {
        // If we're tabbing backwards off the article we're currently shifted to,
        // jump back to the next button. This is the inverse of the above.
        e.preventDefault();
        this.nextBtn.disabled ? this.prevBtn.focus() : this.nextBtn.focus();
      }
    }
  };
  return Constructor;
}]);
}, {"1":1,"107":107}];
