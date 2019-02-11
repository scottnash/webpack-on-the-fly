window.modules["136"] = [function(require,module,exports){'use strict';
/**
 * Given an HTML element, find the last of its siblings that shares its
 * offset top.
 * @param  {HtmlElement} targetNode
 * @return {HtmlElement}
 */

module.exports = function lastNodeInRow(targetNode) {
  var children = targetNode.parentNode.children,
      i,
      sibling,
      nodeOffsetTop = targetNode.offsetTop,
      child;

  for (i = 0; i < children.length; i++) {
    child = children[i];

    if (child.style.display !== 'none' && child !== targetNode) {
      sibling = children[i];

      if (sibling.offsetTop > nodeOffsetTop) {
        return children[i - 1];
      }
    }
  }

  return children[children.length - 1];
};
}, {}];
