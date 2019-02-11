window.modules["contact-form.model"] = [function(require,module,exports){(function (process){
'use strict';

module.exports.render = function (ref, data) {
  data.formEndpoint = window.process.env.CLAY_CONTACT_FORM_ENDPOINT;
  return data;
};

}).call(this,require(22))}, {"22":22}];
