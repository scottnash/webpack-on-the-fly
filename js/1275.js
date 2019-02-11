window.modules["1275"] = [function(require,module,exports){'use strict';
/**
 * Converts URLs to SSL-compliant sites to schemeless and
 * URLs to *.nymag.com resources (e.g. pixel.nymag.com) to
 * HTTPS. Helps prevent active mixed content and keep
 * internal users on HTTP sites.
 **/

var urlParse = require(38),
    _endsWith = require(895),
    _includes = require(33),
    SSL_HOSTS = ['www.thecut.com', 'localhost.thecut.com', 'www.vulture.com', 'localhost.vulture.com'];
/**
 * Converts URLs to nymag resources and specified hosts to schemeless.
 * @param {string} url
 * @param {boolean} useHttps Convert to explicit HTTPS instead
 * @returns {string}
 */


function fixScheme(url, useHttps) {
  if (typeof url === 'string') {
    var parsed = urlParse(url),
        hostname = parsed.hostname;

    if (!hostname) {
      return url;
    } else if (_endsWith(hostname, '.nymag.com') && hostname !== 'qa.nymag.com') {
      parsed.set('protocol', 'https:');
    } else if (_includes(SSL_HOSTS, hostname)) {
      parsed.set('protocol', useHttps === true ? 'https:' : '');
    }

    return parsed.toString();
  }

  return url;
}

;
module.exports = fixScheme;
}, {"33":33,"38":38,"895":895}];
