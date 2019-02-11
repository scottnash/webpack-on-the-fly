window.modules["vulture-header.model"] = [function(require,module,exports){'use strict';

var striptags = require(42),
    sanitize = require(39),
    _startCase = require(111);

module.exports.save = function (uri, data) {
  data.sectionLinks.forEach(function (link) {
    link.text = link.text ? sanitize.toSmartText(link.text) : '';
  });
  data.hotTopics.forEach(function (topic) {
    topic.text = topic.text ? sanitize.toSmartText(striptags(topic.text, ['em', 'i', 's', 'strike'])) : '';
  });
  return data;
};

module.exports.render = function (uri, data, locals) {
  data.sectionHeading = '';

  if (locals && locals.params && data.pageType === 'Section Page') {
    data.sectionHeading = _startCase(locals.params.name);
  }

  return data;
};
}, {"39":39,"42":42,"111":111}];
