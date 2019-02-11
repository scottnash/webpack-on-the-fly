window.modules["memo-pixel.client"] = [function(require,module,exports){'use strict'; // embed code provided by SimpleReach
// Without an element in the body, the code inside the module.exports function never gets called,
// so simply using an IIFE to trigger the js insertion.

(function () {
  var s = document.createElement('script');
  s.async = true;
  s.type = 'text/javascript';
  s.src = document.location.protocol + '//d16xpr36wrmcmk.cloudfront.net/js/memo.js';
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(s);
})();

module.exports = function () {};
}, {}];
