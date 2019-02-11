window.modules["nav-dropdown-button.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    nymagHeader = dom.find('.nymag-header');

function getNextSiblings(el) {
  var siblings = [];
  var elem = el;

  while (elem = elem.nextElementSibling) {
    siblings.push(elem);
  }

  return siblings;
}
/*
* Look up and return all components that are on the page
* except the element passed
*/


function getMainChildren(el) {
  var allButNymagHeader = [],
      elem = el.firstChild;

  while (elem = elem.nextElementSibling) {
    if (!elem.contains(nymagHeader)) {
      allButNymagHeader.push(elem);
    } else if (!elem.isSameNode(nymagHeader)) {
      allButNymagHeader = allButNymagHeader.concat(getMainChildren(elem));
    }
  }

  return allButNymagHeader;
}

module.exports = function (el) {
  var savedScrollY;
  var button = el.querySelector('.nav-dropdown-button-trigger'),
      body = dom.find('body'),
      top = dom.find('.top'),
      nymagHomepageVariation = 'nav-dropdown-button_nymag-homepage',
      header = dom.find('header.page-header'),
      main = dom.find('[data-editable="main"]');
  button.addEventListener('click', function () {
    toggleNav();
  }); // close with click outside dropdown

  body.addEventListener('click', function (e) {
    if (!el.contains(e.target) && el.classList.contains('open')) {
      toggleNav();
    }
  }); // close with esc key

  document.addEventListener('keydown', function (e) {
    if (e.keyCode === 27 && el.classList.contains('open')) {
      toggleNav();
    }
  });

  function toggleNav() {
    var isMobile = window.innerWidth < 768,
        isChildOfMain = main.contains(el);

    if (el.classList.contains('open')) {
      button.setAttribute('aria-expanded', 'false');
    } else {
      button.setAttribute('aria-expanded', 'true');
      savedScrollY = window.scrollY; // save the scroll position before toggling classes
    }

    el.classList.toggle('closed');
    el.classList.toggle('open');
    body.classList.toggle('disabled');

    if (isMobile && !isChildOfMain && header) {
      toggleBodyComponents(header);
      rescroll();
    } else if (isMobile && el.classList.contains(nymagHomepageVariation)) {
      toggleEverythingButNymagHeader();
    }
  } // Hide every component on the page except this component


  function toggleEverythingButNymagHeader() {
    var mainComponent = getMainChildren(main);
    top.classList.toggle('hidden-component');
    el.classList.toggle('open-mobile');
    toggleBodyComponents(main);
    addHiddenComponentClass(mainComponent);
  }

  function toggleBodyComponents(component) {
    var sections = getNextSiblings(component);
    addHiddenComponentClass(sections);
  }

  function addHiddenComponentClass(components) {
    components.forEach(function (cmpt) {
      cmpt.classList.toggle('hidden-component');
    });
  }

  function rescroll() {
    var scrollPositionTop = el.classList.contains('open') ? 0 : savedScrollY;
    window.scrollTo({
      top: scrollPositionTop
    });
  }
};
}, {"1":1}];
