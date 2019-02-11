window.modules["account.client"] = [function(require,module,exports){'use strict';

var Vue = require(3),
    dom = require(1),
    account = require(2);
/**
 * initialize the component. loads Vue and sets up components
 * @param  {Element} el
 */


function init(el) {
  var appStoreInstructions = el.querySelector('.account-hidden-instructions').innerHTML,
      exampleImage = el.querySelector('.account-hidden-instructions').getAttribute('data-image-url'),
      closeIcon = el.querySelector('.account-hidden-close-icon').innerHTML,
      editIcon = el.querySelector('.account-hidden-edit-icon').innerHTML,
      linkIcon = el.querySelector('.account-hidden-link-icon').innerHTML,
      Account = Vue.component('account', account),
      app = new Account({
    appStoreInstructions: appStoreInstructions,
    exampleImage: exampleImage,
    closeIcon: closeIcon,
    editIcon: editIcon,
    linkIcon: linkIcon
  }).$mount(); // replace the contents of the component with the vue app

  dom.clearChildren(el);
  el.appendChild(app.$el);
}

module.exports = init;
}, {"1":1,"2":2,"3":3}];
