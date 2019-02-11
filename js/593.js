window.modules["593"] = [function(require,module,exports){/*
* Underscore.string
* (c) 2010 Esa-Matti Suuronen <esa-matti aet suuronen dot org>
* Underscore.string is freely distributable under the terms of the MIT license.
* Documentation: https://github.com/epeli/underscore.string
* Some code is borrowed from MooTools and Alexandru Marasteanu.
* Version '3.3.4'
* @preserve
*/

'use strict';

function s(value) {
  /* jshint validthis: true */
  if (!(this instanceof s)) return new s(value);
  this._wrapped = value;
}

s.VERSION = '3.3.4';

s.isBlank          = require(1228);
s.stripTags        = require(1241);
s.capitalize       = require(1184);
s.decapitalize     = require(1183);
s.chop             = require(1187);
s.trim             = require(1182);
s.clean            = require(1189);
s.cleanDiacritics  = require(1190);
s.count            = require(1191);
s.chars            = require(1186);
s.swapCase         = require(1225);
s.escapeHTML       = require(1196);
s.unescapeHTML     = require(1242);
s.splice           = require(1214);
s.insert           = require(1213);
s.replaceAll       = require(1227);
s.include          = require(1206);
s.join             = require(1226);
s.lines            = require(1207);
s.dedent           = require(1193);
s.reverse          = require(1215);
s.startsWith       = require(1229);
s.endsWith         = require(1194);
s.pred             = require(1247);
s.succ             = require(1245);
s.titleize         = require(1230);
s.camelize         = require(1181);
s.underscored      = require(1205);
s.dasherize        = require(1192);
s.classify         = require(1188);
s.humanize         = require(1204);
s.ltrim            = require(1244);
s.rtrim            = require(1246);
s.truncate         = require(1231);
s.prune            = require(1232);
s.words            = require(1216);
s.pad              = require(1243);
s.lpad             = require(1218);
s.rpad             = require(1217);
s.lrpad            = require(1219);
s.sprintf          = require(1248);
s.vsprintf         = require(1249);
s.toNumber         = require(1208);
s.numberFormat     = require(1209);
s.strRight         = require(1233);
s.strRightBack     = require(1234);
s.strLeft          = require(1235);
s.strLeftBack      = require(1236);
s.toSentence       = require(1220);
s.toSentenceSerial = require(1222);
s.slugify          = require(1221);
s.surround         = require(1210);
s.quote            = require(1223);
s.unquote          = require(1211);
s.repeat           = require(1237);
s.naturalCmp       = require(1212);
s.levenshtein      = require(1238);
s.toBoolean        = require(1224);
s.exports          = require(1198);
s.escapeRegExp     = require(1201);
s.wrap             = require(1240);
s.map              = require(1239);

// Aliases
s.strip     = s.trim;
s.lstrip    = s.ltrim;
s.rstrip    = s.rtrim;
s.center    = s.lrpad;
s.rjust     = s.lpad;
s.ljust     = s.rpad;
s.contains  = s.include;
s.q         = s.quote;
s.toBool    = s.toBoolean;
s.camelcase = s.camelize;
s.mapChars  = s.map;


// Implement chaining
s.prototype = {
  value: function value() {
    return this._wrapped;
  }
};

function fn2method(key, fn) {
  if (typeof fn !== 'function') return;
  s.prototype[key] = function() {
    var args = [this._wrapped].concat(Array.prototype.slice.call(arguments));
    var res = fn.apply(null, args);
    // if the result is non-string stop the chain and return the value
    return typeof res === 'string' ? new s(res) : res;
  };
}

// Copy functions to instance methods for chaining
for (var key in s) fn2method(key, s[key]);

fn2method('tap', function tap(string, fn) {
  return fn(string);
});

function prototype2method(methodName) {
  fn2method(methodName, function(context) {
    var args = Array.prototype.slice.call(arguments, 1);
    return String.prototype[methodName].apply(context, args);
  });
}

var prototypeMethods = [
  'toUpperCase',
  'toLowerCase',
  'split',
  'replace',
  'slice',
  'substring',
  'substr',
  'concat'
];

for (var method in prototypeMethods) prototype2method(prototypeMethods[method]);


module.exports = s;
}, {"1181":1181,"1182":1182,"1183":1183,"1184":1184,"1186":1186,"1187":1187,"1188":1188,"1189":1189,"1190":1190,"1191":1191,"1192":1192,"1193":1193,"1194":1194,"1196":1196,"1198":1198,"1201":1201,"1204":1204,"1205":1205,"1206":1206,"1207":1207,"1208":1208,"1209":1209,"1210":1210,"1211":1211,"1212":1212,"1213":1213,"1214":1214,"1215":1215,"1216":1216,"1217":1217,"1218":1218,"1219":1219,"1220":1220,"1221":1221,"1222":1222,"1223":1223,"1224":1224,"1225":1225,"1226":1226,"1227":1227,"1228":1228,"1229":1229,"1230":1230,"1231":1231,"1232":1232,"1233":1233,"1234":1234,"1235":1235,"1236":1236,"1237":1237,"1238":1238,"1239":1239,"1240":1240,"1241":1241,"1242":1242,"1243":1243,"1244":1244,"1245":1245,"1246":1246,"1247":1247,"1248":1248,"1249":1249}];
