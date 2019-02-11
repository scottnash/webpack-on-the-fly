window.modules["panotour.model"] = [function(require,module,exports){'use strict';

module.exports.save = function (ref, data) {
  var url = data.url,
      embedCode = url && url.match(/src=['"](.*?)['"]/i); // find first src="(url)"
  // if they pasted in a full embed code, parse out the url

  if (embedCode) {
    data.url = embedCode[1];
  }

  return data;
};
}, {}];
