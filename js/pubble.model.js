window.modules["pubble.model"] = [function(require,module,exports){'use strict';

var rest = require(5),
    PUBBLE_ENDPOINT = 'https://www.pubble.io/api/init.htm';
/**
 * send a request to the pubble api to grab info for the specific embed
 * @param {object} data
 * @param {string} data.id
 * @returns {Promise}
 */


function addPubbleInfo(data) {
  var url = "".concat(PUBBLE_ENDPOINT, "?v=1467363787626&appID=").concat(data.id);
  return rest.getJSONP(url).then(function (res) {
    data.name = res.appName;
    data.startDate = new Date(res.startDate.time).toISOString();
    return data;
  });
}

module.exports.save = function (ref, data) {
  var id = data.id; // if the ID is empty, pass it on
  // if the ID is a 5-digit number, pass it on
  // otherwise, assume it's a pasted embed code and parse that for the ID
  // note: we assume all pebble ids are 5-digit numbers

  if (!id) {
    return data;
  } else if (id.length && !id.match(/^\d{5}$/)) {
    var matches = id.match(/\d{5}/);

    if (matches) {
      data.id = matches[0];
    } else {
      throw new Error('Cannot find Pubble ID!');
    }
  } // if there's an id, grab data from pubble's api. otherwise, just save it


  return data.id && data.id.length ? addPubbleInfo(data) : data;
};
}, {"5":5}];
