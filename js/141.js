window.modules["141"] = [function(require,module,exports){'use strict';

var Eventify = require(143),
    objectAssign = require(142);
/**
 * An object that emits changes to its properties.
 * @param {Object} defaults - An object with default properties
 */


function State(defaults) {
  if (defaults) {
    objectAssign(this, defaults);
  }
}

objectAssign(State.prototype, Eventify.proto);

State.prototype.change = function (prop, newVal) {
  if (this[prop] !== newVal) {
    this.trigger(prop, this[prop], newVal);
    this[prop] = newVal;
  }
};

module.exports = State;
}, {"142":142,"143":143}];
