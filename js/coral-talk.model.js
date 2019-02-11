window.modules["coral-talk.model"] = [function(require,module,exports){(function (process){
'use strict';

module.exports.render = function (ref, data, locals) {
  var site = locals.site;
  data.CORAL_TALK_HOST = "".concat(site.host).concat(window.process.env.TALK_PATH);
  return data;
};

}).call(this,require(22))}, {"22":22}];
