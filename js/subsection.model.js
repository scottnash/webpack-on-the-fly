window.modules["subsection.model"] = [function(require,module,exports){'use strict';

var _includes = require(33),
    utils = require(43),
    styles = require(44),
    sanitize = require(39);

module.exports.save = function (ref, data) {
  // run titles through headline quotes
  if (!utils.isFieldEmpty(data.title)) {
    data.title = sanitize.toSmartHeadline(data.title); // generate ID for in-page anchors

    data.titleId = sanitize.toPlainText(data.title);
  }

  if (_includes(data.title, '<a')) {
    data.hasLink = true;
  } // add per-instance styles


  if (utils.isFieldEmpty(data.sass)) {
    delete data.css;
    return data;
  } else {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  }
};
}, {"33":33,"39":39,"43":43,"44":44}];
