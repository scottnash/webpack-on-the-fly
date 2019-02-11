window.modules["1277"] = [function(require,module,exports){'use strict';

var _isEmpty = require(75),
    _isArray = require(129),
    _isObject = require(74),
    _reduce = require(124);

function combineAddress(address) {
  if (_isArray(address)) {
    var addressString = '',
        separator;
    return _reduce(address, function (addressString, a, i) {
      separator = i === address.length - 1 ? '' : '; ';
      return addressString += [a.line_1, a.cross_streets, a.line_2, a.city, a.state, a.zip].filter(function (i) {
        return !_isEmpty(i);
      }).join(', ') + separator;
    }, addressString);
  } else if (_isObject(address)) {
    return [address.line_1, address.cross_streets, address.line_2, address.city, address.state, address.zip].filter(function (i) {
      return !_isEmpty(i);
    }).join(', ');
  } else {
    return '';
  }
}

function getContactString(contact) {
  if (contact) {
    var address = contact.address,
        phone = contact.phone,
        website = contact.website;
    return [combineAddress(address), phone, website].filter(function (i) {
      return !_isEmpty(i);
    }).join('; ');
  }

  return '';
}

module.exports.getContactString = getContactString;
module.exports.combineAddress = combineAddress;
}, {"74":74,"75":75,"124":124,"129":129}];
