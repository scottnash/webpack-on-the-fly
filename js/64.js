window.modules["64"] = [function(require,module,exports){'use strict';
/**
 * Given a DocumentFragment of a growl body and its id insert
 * the growl into the document body and initialize its clientjs
 * @param {DocumentFragment} frag 
 * @param {string} growlId
 * @param {object} opts
 * @param {*} opts.content
 * @param {string|number} opts.scrollDepth
 * @param {function|null} opts.onShow
 */

function generate(frag, growlId, _ref) {
  var content = _ref.content,
      scrollDepth = _ref.scrollDepth,
      onShow = _ref.onShow;
  var growl;
  document.querySelector('body').appendChild(frag);
  growl = document.querySelector(growlId);

  require("growl.client")(growl, {
    content: content,
    onShow: onShow,
    scrollDepth: scrollDepth
  });
}

module.exports.generateGrowl = generate;
}, {"growl.client":"growl.client"}];
