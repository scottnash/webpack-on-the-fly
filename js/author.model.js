window.modules["author.model"] = [function(require,module,exports){'use strict';

var _last = require(24);
/**
 * munge data into a standardized format
 * @param {object} data
 * @returns {object}
 */


function mungeData(data) {
  if (data.twitter) {
    data.twitter = data.twitter.replace(/^@/, ''); // remove @ sign if it exists

    data.twitter = _last(data.twitter.split('/')); // remove any url business
  }

  if (data.facebook) {
    data.facebook = _last(data.facebook.split('/')); // remove any url business and grab the username

    data.facebook = _last(data.facebook.split('=')); // remove profile php if it exists
  }

  if (data.instagram) {
    data.instagram = data.instagram.replace(/^@/, ''); // remove @ sign if it exists

    data.instagram = _last(data.instagram.split('/')); // remove any url business
  }

  return data;
}

module.exports.save = function (ref, data) {
  return mungeData(data);
};
}, {"24":24}];
