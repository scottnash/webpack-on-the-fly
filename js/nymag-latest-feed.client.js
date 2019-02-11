window.modules["nymag-latest-feed.client"] = [function(require,module,exports){'use strict';

var dom = require(1);

module.exports = function (el) {
  var tabs = Array.from(dom.findAll(el, '.tab-trigger')),
      activeTab = {},
      expandButton = dom.find(el, '.expand-button'),
      tabsContainer = dom.find(el, '.tabs');
  setActiveTab(tabs[0]);
  toggleActiveTab(true);
  tabs.forEach(addListeners);
  el.addEventListener('keyup', handleKeyPress);
  expandButton.addEventListener('click', expandTab);

  function expandTab() {
    var firstNewItem = dom.find(activeTab.panel, '.mobile-collapsed a');
    el.classList.toggle('expanded'); // focus on the first item un-hidden after expansion

    if (firstNewItem) {
      firstNewItem.focus();
    }
  }

  function handleKeyPress(e) {
    var key = e.key,
        currentIndex = activeTab.trigger.index;
    var targetIndex;

    switch (key) {
      case 'Left':
      case 'ArrowLeft':
        targetIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;

      case 'Right':
      case 'ArrowRight':
        targetIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
        break;

      default:
        return;
    }

    e.preventDefault();
    handleTabEvent(tabs[targetIndex], true);
  }

  function setActiveTab(tab) {
    var trigger = tab,
        tabName = tab.getAttribute('aria-controls'),
        panel = dom.find(el, "#".concat(tabName)),
        heading = dom.find(el, "#".concat(tabName, "-title")),
        link = dom.find(el, "#".concat(tabName, "-link"));
    activeTab = {
      trigger: trigger,
      panel: panel,
      heading: heading,
      link: link
    };
  }

  function addListeners(tab, idx) {
    tab.addEventListener('mouseover', function () {
      return handleTabEvent(tab, true);
    });
    tab.addEventListener('focus', function () {
      return handleTabEvent(tab);
    });
    tab.index = idx;
  }

  function handleTabEvent(trigger, resetFocus) {
    if (trigger === activeTab.trigger) {
      return;
    }

    toggleActiveTab(false);
    setActiveTab(trigger);
    toggleActiveTab(true);

    if (resetFocus) {
      trigger.focus();
    }
  }

  function toggleActiveTab(isActive) {
    activeTab.trigger.setAttribute('aria-selected', isActive);
    activeTab.panel.classList.toggle('active', isActive);
    activeTab.heading.classList.toggle('active', isActive);

    if (activeTab.link) {
      activeTab.link.classList.toggle('active', isActive);
    }

    if (isActive) {
      activeTab.trigger.removeAttribute('tabindex');
      tabsContainer.scrollTop = 0;
    } else {
      activeTab.trigger.setAttribute('tabindex', '-1');
    }
  }
};
}, {"1":1}];
