window.modules["137"] = [function(require,module,exports){'use strict';
/**
 * Poll an iFrame for changes in the height of a specified element (often a child of the iFrame)
 * and will adjust the iFrame's height to match the height of that element.
 * @param {HtmlElement} frame
 * @param {HtmlElement} targetNode
 * @param {Object} conf
 * @param {Number} conf.interval - How often to poll for size change
 * @param {Number} conf.padding - Extra space to add to the top and bottom of the iFrame
 */

function FrameResizer(frame, targetNode, conf) {
  this.conf = conf || {};
  this.frame = frame, this.targetNode = targetNode;
  this.watch();
}

FrameResizer.prototype.watch = function () {
  this.interval = setInterval(this.resize.bind(this), this.conf.interval || 100);
};

FrameResizer.prototype.kill = function () {
  clearInterval(this.interval);
};

FrameResizer.prototype.resize = function () {
  this.frame.height = this.targetNode.clientHeight + (this.conf.padding || 0) * 2;
};

module.exports = FrameResizer;
}, {}];
