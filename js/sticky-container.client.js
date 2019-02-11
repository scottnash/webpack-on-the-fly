window.modules["sticky-container.client"] = [function(require,module,exports){'use strict';

var dom = require(1);
/**
 * getItemFromSpace
 *
 * @param {Element} space a clay-space component
 * @returns {Element} the visible component in the space
 */


function getItemFromSpace(space) {
  var logic = dom.find(space, '.space-logic');

  if (!logic || !logic.children) {
    return;
  }

  return logic.children[0];
}
/**
 * duplicateItem
 *
 * clones components so they can be repeated in the list
 * handles reinitializing ads and other components that have DS controllers
 *
 * @param {Element} item an element to be duplicated
 * @returns {Element} duplicated element
 */


function duplicateItem(item) {
  var duplicate, input, label, newId; // if the item is an ad, we need to duplicate its attributes and call the DS handler on the new element to get it populated by DFP
  // otherwise just clone the item and all its children

  if (item.classList.contains('ad')) {
    duplicate = item.cloneNode();
    duplicate.id = 'ad-cid-' + Math.round(Math.random() * 10000000);
    duplicate.removeAttribute('data-google-query-id');
  } else {
    duplicate = item.cloneNode(true);

    if (duplicate.classList.contains('newsletter-flex-text')) {
      input = dom.find(duplicate, '.email');
      label = dom.find(duplicate, '.email-label'); // set a new id so the browser doesn't complain

      newId = 'columnSubscribeEmail-' + Math.round(Math.random() * 100000);
      input.id = newId;
      label.setAttribute('for', newId);
      DS.get('newsletter-flex-text', duplicate);
    }
  }

  return duplicate;
}

module.exports = function (el) {
  var children = Array.from(el.children);
  var i = 0,
      item,
      itemContent;

  for (i; i < children.length; i++) {
    item = children[i];
    itemContent = item.classList.contains('clay-space') ? getItemFromSpace(item) : item;
    el.removeChild(item);

    if (itemContent) {
      el.appendChild(duplicateItem(itemContent));
    }
  }
};
}, {"1":1}];
