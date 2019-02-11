window.modules["959"] = [function(require,module,exports){var resolveName = require(378).property;
var handlers = {
    'font': require(961),
    'font-weight': require(960),
    'background': require(962)
};

module.exports = function compressValue(node) {
    if (!this.declaration) {
        return;
    }

    var property = resolveName(this.declaration.property);

    if (handlers.hasOwnProperty(property.name)) {
        handlers[property.name](node);
    }
};
}, {"378":378,"960":960,"961":961,"962":962}];
