window.modules["intelligencer-header.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    _startCase = require(111);

module.exports.render = function (uri, data, locals) {
  data.sectionHeading = '';

  if (data.pageType === 'section-page') {
    data.sectionHeading = _startCase(_get(locals, 'params.name', ''));

    if (data.sectionHeading === 'Tech') {
      data.sectionHeading = 'Technology';
    }
  }

  return data;
};
}, {"32":32,"111":111}];
