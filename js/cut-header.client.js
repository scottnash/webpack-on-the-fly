window.modules["cut-header.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    _throttle = require(23);

DS.controller('cut-header', ['$window', function ($window) {
  function Constructor(el) {
    var body = dom.find('body');
    this.el = el;
    this.menubtn = dom.findAll(el, '.menu-btn')[1];
    this.menu = dom.find(el, '.right');
    this.logo = dom.find(el, '.left');
    this.expandedNav = dom.find(el, '#expanded-nav');
    this.menuBtnMobile = dom.find(el, '.menu-btn.mobile');
    this.sections = dom.findAll('main, footer, section:not(.search):not(.ad-splash)');
    this.scrolling = false;
    this.maxWidth = el.classList.contains('homepage-breakpoints') ? 767 : 600;
    this.nav = dom.find(el, '.nav');
    $window.innerWidth < this.maxWidth && $window.addEventListener('scroll', _throttle(this.scrollDetect.bind(this), 200));
    body.addEventListener('click', this.handleBodyClick.bind(this));
    document.onkeydown = this.handleKeydown.bind(this);
  }

  Constructor.prototype = {
    events: {
      '.menu-btn click': 'chevronClickHandler'
    },
    chevronClickHandler: function chevronClickHandler() {
      this.menu.classList.toggle('is-active');
      this.logo.classList.toggle('menu-open');
      this.menubtn.classList.toggle('nav-open');

      if (this.menu.classList.contains('is-active')) {
        this.menubtn.setAttribute('aria-expanded', 'true');
        this.menuBtnMobile.setAttribute('aria-expanded', 'true');
        $window.innerWidth <= this.maxWidth && this.toggleHomePage();
      } else {
        this.menubtn.setAttribute('aria-expanded', 'false');
        this.menuBtnMobile.setAttribute('aria-expanded', 'false');
        $window.innerWidth <= this.maxWidth && this.toggleHomePage();
      }
    },
    scrollDetect: function scrollDetect() {
      $window.scrollY > 0 ? this.scrolling = true : this.scrolling = false;
      this.scrolling ? this.nav.classList.add('scrolling') : this.nav.classList.remove('scrolling');
    },
    closeNav: function closeNav() {
      this.menu.classList.toggle('is-active');
      this.logo.classList.toggle('menu-open');
      this.menubtn.classList.toggle('nav-open');
      this.menubtn.setAttribute('aria-expanded', 'false');
      this.menuBtnMobile.setAttribute('aria-expanded', 'false');
    },
    toggleHomePage: function toggleHomePage() {
      this.sections.forEach(function (component) {
        component.classList.toggle('hidden-component');
      });
    },
    handleKeydown: function handleKeydown(e) {
      var event = e || window.event; // keyCode 27 is the escape key. clicking the escape key should close the nav

      if (event.keyCode === 27 && this.menu.classList.contains('is-active')) {
        this.closeNav();
      }
    },
    handleBodyClick: function handleBodyClick(e) {
      if (!this.nav.contains(e.target) && e.target !== this.menuBtnMobile && this.menu.classList.contains('is-active')) {
        this.closeNav();
      }
    }
  };
  return Constructor;
}]);
}, {"1":1,"23":23}];
