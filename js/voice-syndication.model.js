window.modules["voice-syndication.model"] = [function(require,module,exports){'use strict';

var _get = require(32),
    sanitize = require(39);
/**
 * set the canonical url from the locals (even if it's already set)
 * @param {object} data
 * @param {object} locals
 */


function setCanonicalUrl(data, locals) {
  if (_get(locals, 'publishUrl')) {
    data.canonicalUrl = locals.publishUrl;
  }
}
/**
 * Remove a .mp3 text if the user enters one for the ids
 * @param {Object} data
 * @returns {Object}
 */


function sanitizeMp3Inputs(data) {
  data.recordingId = (data.recordingId || '').trim().replace(/\.mp3$/, '');
  data.appleSponsorId = (data.appleSponsorId || '').trim().replace(/\.mp3$/, '');
  return data;
}

module.exports.save = function (uri, data, locals) {
  setCanonicalUrl(data, locals); // voice headline shouldn't have any html

  data.headline = sanitize.toPlainText(sanitize.stripUnicode(data.headline));
  data.dek = sanitize.toPlainText(sanitize.stripUnicode(data.dek));
  return sanitizeMp3Inputs(data);
};
}, {"32":32,"39":39}];
