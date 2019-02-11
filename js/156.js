window.modules["156"] = [function(require,module,exports){"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* jshint ignore:start */

/* eslint-disable */
// start https://mixpanel.com/help/reference/javascript
// sourced on 2016-09-28
// has slight modification as indicated below
(function (e, a) {
  if (!a.__SV) {
    var b = window;

    try {
      var c,
          l,
          i,
          j = b.location,
          g = j.hash;

      c = function c(a, b) {
        return (l = a.match(RegExp(b + "=([^&]*)"))) ? l[1] : null;
      };

      g && c(g, "state") && (i = JSON.parse(decodeURIComponent(c(g, "state"))), "mpeditor" === i.action && (b.sessionStorage.setItem("_mpcehash", g), history.replaceState(i.desiredHash || "", e.title, j.pathname + j.search)));
    } catch (m) {}

    var k, h;
    window.mixpanel = a;
    a._i = [];

    a.init = function (b, c, f) {
      function e(b, a) {
        var c = a.split(".");
        2 == c.length && (b = b[c[0]], a = c[1]);

        b[a] = function () {
          b.push([a].concat(Array.prototype.slice.call(arguments, 0)));
        };
      }

      var d = a;
      "undefined" !== typeof f ? d = a[f] = [] : f = "mixpanel";
      d.people = d.people || [];

      d.toString = function (b) {
        var a = "mixpanel";
        "mixpanel" !== f && (a += "." + f);
        b || (a += " (stub)");
        return a;
      };

      d.people.toString = function () {
        return d.toString(1) + ".people (stub)";
      };

      k = "disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");

      for (h = 0; h < k.length; h++) {
        e(d, k[h]);
      }

      a._i.push([b, c, f]);
    };

    a.__SV = 1.2;
    /* replaced these lines as we are not using their ajax
    b=e.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";c=e.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c)
    */

    loadAfterInit(); // added this line
  }
})(document, window.mixpanel || []); // end https://mixpanel.com/help/reference/javascript
// wrap in function so that it runs after mixpanel.init


function loadAfterInit() {
  // start http://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js
  // sourced 2016-09-28
  (function () {
    var m = !0,
        n = null,
        r = !1;

    function B() {
      return function () {};
    }

    (function () {
      function V(a) {
        function b() {
          try {
            a.F = a.F || {}, a.F.$__c = (a.F.$__c || 0) + 1, c.cookie.set("mp_" + d + "__c", a.F.$__c, 1, m);
          } catch (b) {
            k.error(b);
          }
        }

        var d = a.c("name");
        a.F = a.F || {};
        a.F.$__c = parseInt(c.cookie.get("mp_" + d + "__c")) || 0;
        c.o(document, "submit", b);
        c.o(document, "change", b);
        var e = n;
        c.o(document, "mousedown", function (a) {
          e = a.target;
        });
        c.o(document, "mouseup", function (a) {
          a.target === e && b();
        });
      }

      function W() {
        function a() {
          if (!a.Zc) Q = a.Zc = m, R = r, c.a(y, function (a) {
            a.oc();
          });
        }

        function b() {
          try {
            document.documentElement.doScroll("left");
          } catch (d) {
            setTimeout(b, 1);
            return;
          }

          a();
        }

        if (document.addEventListener) "complete" === document.readyState ? a() : document.addEventListener("DOMContentLoaded", a, r);else if (document.attachEvent) {
          document.attachEvent("onreadystatechange", a);
          var d = r;

          try {
            d = window.frameElement === n;
          } catch (e) {}

          document.documentElement.doScroll && d && b();
        }
        c.o(window, "load", a, m);
      }

      function X() {
        s.init = function (a, b, d) {
          if (d) return s[d] || (s[d] = y[d] = H(a, b, d), s[d].sa()), s[d];
          d = s;
          if (y.mixpanel) d = y.mixpanel;else if (a) d = H(a, b, "mixpanel"), d.sa(), y.mixpanel = d;
          s = d;
          1 === L && (window.mixpanel = s);
          Y();
        };
      }

      function Y() {
        c.a(y, function (a, b) {
          "mixpanel" !== b && (s[b] = a);
        });
        s._ = c;
      }

      function H(a, b, d) {
        var e,
            g = "mixpanel" === d ? s : s[d];
        if (g && 0 === L) e = g;else {
          if (g && !c.isArray(g)) {
            k.error("You have already initialized " + d);
            return;
          }

          e = new h();
        }
        e.Na(a, b, d);
        e.people = new p();
        e.people.Na(e);
        z = z || e.c("debug");
        e.__autotrack_enabled = e.c("autotrack");

        if (e.c("autotrack")) {
          C.$c(e.c("token"), 100, 100) ? C.ed() ? C.U(e) : (e.__autotrack_enabled = r, k.log("Disabling Automatic Event Collection because this browser is not supported")) : (e.__autotrack_enabled = r, k.log("Not in active bucket: disabling Automatic Event Collection."));

          try {
            V(e);
          } catch (j) {
            k.error(j);
          }
        }

        !c.d(g) && c.isArray(g) && (e.Ka.call(e.people, g.people), e.Ka(g));
        return e;
      }

      function p() {}

      function h() {}

      function o(a) {
        this.props = {};
        this.Eb = r;
        this.name = a.persistence_name ? "mp_" + a.persistence_name : "mp_" + a.token + "_mixpanel";
        var b = a.persistence;
        if ("cookie" !== b && "localStorage" !== b) k.ca("Unknown persistence type " + b + "; falling back to cookie"), b = a.persistence = "cookie";

        if (b = "localStorage" === b) {
          b = m;

          try {
            c.localStorage.set("__mplssupport__", "xyz"), "xyz" !== c.localStorage.get("__mplssupport__") && (b = r), c.localStorage.remove("__mplssupport__");
          } catch (d) {
            b = r;
          }

          b || k.error("localStorage unsupported; falling back to cookie store");
        }

        this.w = b ? c.localStorage : c.cookie;
        this.load();
        this.cc(a);
        this.Fd(a);
        this.save();
      }

      function I() {
        this.Tb = "submit";
      }

      function D() {
        this.Tb = "click";
      }

      function x() {}

      var z = r,
          w;
      w = "undefined" === typeof window ? {
        navigator: {}
      } : window;
      var M = Array.prototype,
          S = Object.prototype,
          E = M.slice,
          G = S.toString,
          J = S.hasOwnProperty,
          u = w.console,
          F = w.navigator,
          v = w.document,
          t = F.userAgent,
          N = Function.prototype.bind,
          T = M.forEach,
          U = M.indexOf;
      w = Array.isArray;
      var O = {},
          c = {
        trim: function trim(a) {
          return a.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
        }
      },
          k = {
        log: function log() {
          if (z && !c.d(u) && u) try {
            u.log.apply(u, arguments);
          } catch (a) {
            c.a(arguments, function (a) {
              u.log(a);
            });
          }
        },
        error: function error() {
          if (z && !c.d(u) && u) {
            var a = ["Mixpanel error:"].concat(c.ja(arguments));

            try {
              u.error.apply(u, a);
            } catch (b) {
              c.a(a, function (a) {
                u.error(a);
              });
            }
          }
        },
        ca: function ca() {
          if (!c.d(u) && u) {
            var a = ["Mixpanel error:"].concat(c.ja(arguments));

            try {
              u.error.apply(u, a);
            } catch (b) {
              c.a(a, function (a) {
                u.error(a);
              });
            }
          }
        }
      };

      c.bind = function (a, b) {
        var d, _e;

        if (N && a.bind === N) return N.apply(a, E.call(arguments, 1));
        if (!c.ab(a)) throw new TypeError();
        d = E.call(arguments, 2);
        return _e = function e() {
          if (!(this instanceof _e)) return a.apply(b, d.concat(E.call(arguments)));
          var c = {};
          c.prototype = a.prototype;
          var j = new c();
          c.prototype = n;
          c = a.apply(j, d.concat(E.call(arguments)));
          return Object(c) === c ? c : j;
        };
      };

      c.Cb = function (a) {
        for (var b in a) {
          "function" === typeof a[b] && (a[b] = c.bind(a[b], a));
        }
      };

      c.a = function (a, b, d) {
        if (!(a === n || void 0 === a)) if (T && a.forEach === T) a.forEach(b, d);else if (a.length === +a.length) for (var c = 0, g = a.length; c < g && !(c in a && b.call(d, a[c], c, a) === O); c++) {
          ;
        } else for (c in a) {
          if (J.call(a, c) && b.call(d, a[c], c, a) === O) break;
        }
      };

      c.u = function (a) {
        a && c.bb(a) && (a = a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"));
        return a;
      };

      c.extend = function (a) {
        c.a(E.call(arguments, 1), function (b) {
          for (var d in b) {
            void 0 !== b[d] && (a[d] = b[d]);
          }
        });
        return a;
      };

      c.isArray = w || function (a) {
        return "[object Array]" === G.call(a);
      };

      c.ab = function (a) {
        try {
          return /^\s*\bfunction\b/.test(a);
        } catch (b) {
          return r;
        }
      };

      c.dd = function (a) {
        return !(!a || !J.call(a, "callee"));
      };

      c.ja = function (a) {
        return !a ? [] : a.ja ? a.ja() : c.isArray(a) || c.dd(a) ? E.call(a) : c.Hd(a);
      };

      c.Hd = function (a) {
        var b = [];
        if (a === n) return b;
        c.a(a, function (a) {
          b[b.length] = a;
        });
        return b;
      };

      c.Nd = function (a) {
        return a;
      };

      c.Lb = function (a, b) {
        var d = r;
        if (a === n) return d;
        if (U && a.indexOf === U) return -1 != a.indexOf(b);
        c.a(a, function (a) {
          if (d || (d = a === b)) return O;
        });
        return d;
      };

      c.g = function (a, b) {
        return -1 !== a.indexOf(b);
      };

      c.Nb = function (a, b) {
        a.prototype = new b();
        a.zd = b.prototype;
      };

      c.j = function (a) {
        return a === Object(a) && !c.isArray(a);
      };

      c.V = function (a) {
        if (c.j(a)) {
          for (var b in a) {
            if (J.call(a, b)) return r;
          }

          return m;
        }

        return r;
      };

      c.d = function (a) {
        return void 0 === a;
      };

      c.bb = function (a) {
        return "[object String]" == G.call(a);
      };

      c.fd = function (a) {
        return "[object Date]" == G.call(a);
      };

      c.hd = function (a) {
        return "[object Number]" == G.call(a);
      };

      c.gd = function (a) {
        return !!(a && 1 === a.nodeType);
      };

      c.Ib = function (a) {
        c.a(a, function (b, d) {
          c.fd(b) ? a[d] = c.ad(b) : c.j(b) && (a[d] = c.Ib(b));
        });
        return a;
      };

      c.timestamp = function () {
        Date.now = Date.now || function () {
          return +new Date();
        };

        return Date.now();
      };

      c.ad = function (a) {
        function b(a) {
          return 10 > a ? "0" + a : a;
        }

        return a.getUTCFullYear() + "-" + b(a.getUTCMonth() + 1) + "-" + b(a.getUTCDate()) + "T" + b(a.getUTCHours()) + ":" + b(a.getUTCMinutes()) + ":" + b(a.getUTCSeconds());
      };

      c.l = function (a) {
        return function () {
          try {
            return a.apply(this, arguments);
          } catch (b) {
            k.ca("Implementation error. Please contact support@mixpanel.com.");
          }
        };
      };

      c.od = function (a) {
        for (var b = ["identify", "_check_and_handle_notifications", "_show_notification"], d = 0; d < b.length; d++) {
          a.prototype[b[d]] = c.l(a.prototype[b[d]]);
        }
      };

      c.pd = function (a) {
        for (var b in a) {
          "function" === typeof a[b] && (a[b] = c.l(a[b]));
        }
      };

      c.za = function (a) {
        var b = {};
        c.a(a, function (a, e) {
          c.bb(a) && 0 < a.length && (b[e] = a);
        });
        return b;
      };

      c.truncate = function (a, b) {
        var d;
        "string" === typeof a ? d = a.slice(0, b) : c.isArray(a) ? (d = [], c.a(a, function (a) {
          d.push(c.truncate(a, b));
        })) : c.j(a) ? (d = {}, c.a(a, function (a, g) {
          d[g] = c.truncate(a, b);
        })) : d = a;
        return d;
      };

      c.na = function () {
        return function (a) {
          function b(a, c) {
            var j = "",
                l = 0,
                i = l = "",
                i = 0,
                f = j,
                h = [],
                q = c[a];
            q && "object" === _typeof(q) && "function" === typeof q.toJSON && (q = q.toJSON(a));

            switch (_typeof(q)) {
              case "string":
                return d(q);

              case "number":
                return isFinite(q) ? "" + q : "null";

              case "boolean":
              case "null":
                return "" + q;

              case "object":
                if (!q) return "null";
                j += "    ";
                h = [];

                if ("[object Array]" === G.apply(q)) {
                  i = q.length;

                  for (l = 0; l < i; l += 1) {
                    h[l] = b(l, q) || "null";
                  }

                  return i = 0 === h.length ? "[]" : j ? "[\n" + j + h.join(",\n" + j) + "\n" + f + "]" : "[" + h.join(",") + "]";
                }

                for (l in q) {
                  J.call(q, l) && (i = b(l, q)) && h.push(d(l) + (j ? ": " : ":") + i);
                }

                return i = 0 === h.length ? "{}" : j ? "{" + h.join(",") + "" + f + "}" : "{" + h.join(",") + "}";
            }
          }

          function d(a) {
            var b = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                d = {
              "\b": "\\b",
              "\t": "\\t",
              "\n": "\\n",
              "\f": "\\f",
              "\r": "\\r",
              '"': '\\"',
              "\\": "\\\\"
            };
            b.lastIndex = 0;
            return b.test(a) ? '"' + a.replace(b, function (a) {
              var b = d[a];
              return "string" === typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + a + '"';
          }

          return b("", {
            "": a
          });
        };
      }();

      c.ma = function () {
        function a() {
          switch (i) {
            case "t":
              return g("t"), g("r"), g("u"), g("e"), m;

            case "f":
              return g("f"), g("a"), g("l"), g("s"), g("e"), r;

            case "n":
              return g("n"), g("u"), g("l"), g("l"), n;
          }

          j('Unexpected "' + i + '"');
        }

        function b() {
          for (; i && " " >= i;) {
            g();
          }
        }

        function d() {
          var a,
              b,
              d = "",
              c;
          if ('"' === i) for (; g();) {
            if ('"' === i) return g(), d;
            if ("\\" === i) {
              if (g(), "u" === i) {
                for (b = c = 0; 4 > b; b += 1) {
                  a = parseInt(g(), 16);
                  if (!isFinite(a)) break;
                  c = 16 * c + a;
                }

                d += String.fromCharCode(c);
              } else if ("string" === typeof f[i]) d += f[i];else break;
            } else d += i;
          }
          j("Bad string");
        }

        function c() {
          var a;
          a = "";
          "-" === i && (a = "-", g("-"));

          for (; "0" <= i && "9" >= i;) {
            a += i, g();
          }

          if ("." === i) for (a += "."; g() && "0" <= i && "9" >= i;) {
            a += i;
          }

          if ("e" === i || "E" === i) {
            a += i;
            g();
            if ("-" === i || "+" === i) a += i, g();

            for (; "0" <= i && "9" >= i;) {
              a += i, g();
            }
          }

          a = +a;
          if (isFinite(a)) return a;
          j("Bad number");
        }

        function g(a) {
          a && a !== i && j("Expected '" + a + "' instead of '" + i + "'");
          i = h.charAt(l);
          l += 1;
          return i;
        }

        function j(a) {
          throw {
            name: "SyntaxError",
            message: a,
            Ld: l,
            text: h
          };
        }

        var l,
            i,
            f = {
          '"': '"',
          "\\": "\\",
          "/": "/",
          b: "\b",
          f: "\f",
          n: "\n",
          r: "\r",
          t: "\t"
        },
            h,
            _q;

        _q = function q() {
          b();

          switch (i) {
            case "{":
              var l;

              a: {
                var f,
                    h = {};

                if ("{" === i) {
                  g("{");
                  b();

                  if ("}" === i) {
                    g("}");
                    l = h;
                    break a;
                  }

                  for (; i;) {
                    f = d();
                    b();
                    g(":");
                    Object.hasOwnProperty.call(h, f) && j('Duplicate key "' + f + '"');
                    h[f] = _q();
                    b();

                    if ("}" === i) {
                      g("}");
                      l = h;
                      break a;
                    }

                    g(",");
                    b();
                  }
                }

                j("Bad object");
              }

              return l;

            case "[":
              a: {
                l = [];

                if ("[" === i) {
                  g("[");
                  b();

                  if ("]" === i) {
                    g("]");
                    f = l;
                    break a;
                  }

                  for (; i;) {
                    l.push(_q());
                    b();

                    if ("]" === i) {
                      g("]");
                      f = l;
                      break a;
                    }

                    g(",");
                    b();
                  }
                }

                j("Bad array");
              }

              return f;

            case '"':
              return d();

            case "-":
              return c();

            default:
              return "0" <= i && "9" >= i ? c() : a();
          }
        };

        return function (a) {
          h = a;
          l = 0;
          i = " ";
          a = _q();
          b();
          i && j("Syntax error");
          return a;
        };
      }();

      c.Ab = function (a) {
        var b,
            d,
            e,
            g,
            j = 0,
            l = 0,
            i = "",
            i = [];
        if (!a) return a;
        a = c.Gd(a);

        do {
          b = a.charCodeAt(j++), d = a.charCodeAt(j++), e = a.charCodeAt(j++), g = b << 16 | d << 8 | e, b = g >> 18 & 63, d = g >> 12 & 63, e = g >> 6 & 63, g &= 63, i[l++] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(b) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(d) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(e) + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(g);
        } while (j < a.length);

        i = i.join("");

        switch (a.length % 3) {
          case 1:
            i = i.slice(0, -2) + "==";
            break;

          case 2:
            i = i.slice(0, -1) + "=";
        }

        return i;
      };

      c.Gd = function (a) {
        var a = (a + "").replace(/\r\n/g, "\n").replace(/\r/g, "\n"),
            b = "",
            d,
            c,
            g = 0,
            j;
        d = c = 0;
        g = a.length;

        for (j = 0; j < g; j++) {
          var l = a.charCodeAt(j),
              i = n;
          128 > l ? c++ : i = 127 < l && 2048 > l ? String.fromCharCode(l >> 6 | 192, l & 63 | 128) : String.fromCharCode(l >> 12 | 224, l >> 6 & 63 | 128, l & 63 | 128);
          i !== n && (c > d && (b += a.substring(d, c)), b += i, d = c = j + 1);
        }

        c > d && (b += a.substring(d, a.length));
        return b;
      };

      c.jb = function () {
        function a() {
          function a(b, c) {
            var d,
                e = 0;

            for (d = 0; d < c.length; d++) {
              e |= j[d] << 8 * d;
            }

            return b ^ e;
          }

          var b,
              c,
              j = [],
              l = 0;

          for (b = 0; b < t.length; b++) {
            c = t.charCodeAt(b), j.unshift(c & 255), 4 <= j.length && (l = a(l, j), j = []);
          }

          0 < j.length && (l = a(l, j));
          return l.toString(16);
        }

        function b() {
          for (var a = 1 * new Date(), b = 0; a == 1 * new Date();) {
            b++;
          }

          return a.toString(16) + b.toString(16);
        }

        return function () {
          var c = (screen.height * screen.width).toString(16);
          return b() + "-" + Math.random().toString(16).replace(".", "") + "-" + a() + "-" + c + "-" + b();
        };
      }();

      c.Ob = function (a) {
        return /(google web preview|baiduspider|yandexbot|bingbot|googlebot|yahoo! slurp)/i.test(a) ? m : r;
      };

      c.ic = function (a) {
        var b,
            d,
            e,
            g = [];
        c.d(b) && (b = "&");
        c.a(a, function (a, b) {
          d = encodeURIComponent(a.toString());
          e = encodeURIComponent(b);
          g[g.length] = e + "=" + d;
        });
        return g.join(b);
      };

      c.Jb = function (a, b) {
        var b = b.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]"),
            c = RegExp("[\\?&]" + b + "=([^&#]*)").exec(a);
        return c === n || c && "string" !== typeof c[1] && c[1].length ? "" : decodeURIComponent(c[1]).replace(/\+/g, " ");
      };

      c.ea = function (a, b) {
        var c = a.match(RegExp(b + "=([^&]*)"));
        return c ? c[1] : n;
      };

      c.cookie = {
        get: function get(a) {
          for (var a = a + "=", b = v.cookie.split(";"), c = 0; c < b.length; c++) {
            for (var e = b[c]; " " == e.charAt(0);) {
              e = e.substring(1, e.length);
            }

            if (0 === e.indexOf(a)) return decodeURIComponent(e.substring(a.length, e.length));
          }

          return n;
        },
        parse: function parse(a) {
          var b;

          try {
            b = c.ma(c.cookie.get(a)) || {};
          } catch (d) {}

          return b;
        },
        vd: function vd(a, b, c, e, g) {
          var d;
          var j = "",
              l = "",
              i = "";
          e && (d = (j = (j = v.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i)) ? j[0] : "") ? "; domain=." + j : "", j = d);
          c && (l = new Date(), l.setTime(l.getTime() + 1E3 * c), l = "; expires=" + l.toGMTString());
          g && (i = "; secure");
          v.cookie = a + "=" + encodeURIComponent(b) + l + "; path=/" + j + i;
        },
        set: function set(a, b, c, e, g) {
          var d;
          var j = "",
              l = "",
              i = "";
          e && (d = (j = (j = v.location.hostname.match(/[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i)) ? j[0] : "") ? "; domain=." + j : "", j = d);
          c && (l = new Date(), l.setTime(l.getTime() + 864E5 * c), l = "; expires=" + l.toGMTString());
          g && (i = "; secure");
          a = a + "=" + encodeURIComponent(b) + l + "; path=/" + j + i;
          return v.cookie = a;
        },
        remove: function remove(a, b) {
          c.cookie.set(a, "", -1, b);
        }
      };
      c.localStorage = {
        error: function error(a) {
          k.error("localStorage error: " + a);
        },
        get: function get(a) {
          try {
            return window.localStorage.getItem(a);
          } catch (b) {
            c.localStorage.error(b);
          }

          return n;
        },
        parse: function parse(a) {
          try {
            return c.ma(c.localStorage.get(a)) || {};
          } catch (b) {}

          return n;
        },
        set: function set(a, b) {
          try {
            window.localStorage.setItem(a, b);
          } catch (d) {
            c.localStorage.error(d);
          }
        },
        remove: function remove(a) {
          try {
            window.localStorage.removeItem(a);
          } catch (b) {
            c.localStorage.error(b);
          }
        }
      };

      c.o = function () {
        function a(a, e, g) {
          return function (j) {
            if (j = j || b(window.event)) {
              var l = m,
                  i;
              c.ab(g) && (i = g(j));
              j = e.call(a, j);
              if (r === i || r === j) l = r;
              return l;
            }
          };
        }

        function b(a) {
          if (a) a.preventDefault = b.preventDefault, a.stopPropagation = b.stopPropagation;
          return a;
        }

        b.preventDefault = function () {
          this.returnValue = r;
        };

        b.stopPropagation = function () {
          this.cancelBubble = m;
        };

        return function (b, c, g, j, l) {
          b ? b.addEventListener && !j ? b.addEventListener(c, g, !!l) : (c = "on" + c, b[c] = a(b, g, b[c])) : k.error("No valid element provided to register_event");
        };
      }();

      c.Yc = function () {
        function a(a, b) {
          return 0 <= (" " + a.className + " ").replace(d, " ").indexOf(" " + b + " ");
        }

        function b(b) {
          if (!v.getElementsByTagName) return [];
          var b = b.split(" "),
              d,
              j,
              l,
              i,
              f,
              h,
              q,
              k = [v];

          for (i = 0; i < b.length; i++) {
            if (d = b[i].replace(/^\s+/, "").replace(/\s+$/, ""), -1 < d.indexOf("#")) {
              j = d.split("#");
              d = j[0];
              k = v.getElementById(j[1]);
              if (!k || d && k.nodeName.toLowerCase() != d) return [];
              k = [k];
            } else if (-1 < d.indexOf(".")) {
              j = d.split(".");
              d = j[0];
              var o = j[1];
              d || (d = "*");
              j = [];

              for (f = l = 0; f < k.length; f++) {
                q = "*" == d ? k[f].all ? k[f].all : k[f].getElementsByTagName("*") : k[f].getElementsByTagName(d);

                for (h = 0; h < q.length; h++) {
                  j[l++] = q[h];
                }
              }

              k = [];

              for (f = d = 0; f < j.length; f++) {
                j[f].className && c.bb(j[f].className) && a(j[f], o) && (k[d++] = j[f]);
              }
            } else if (j = d.match(/^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/)) {
              d = j[1];
              var p = j[2],
                  o = j[3],
                  A = j[4];
              d || (d = "*");
              j = [];

              for (f = l = 0; f < k.length; f++) {
                q = "*" == d ? k[f].all ? k[f].all : k[f].getElementsByTagName("*") : k[f].getElementsByTagName(d);

                for (h = 0; h < q.length; h++) {
                  j[l++] = q[h];
                }
              }

              k = [];
              d = 0;

              switch (o) {
                case "=":
                  o = function o(a) {
                    return a.getAttribute(p) == A;
                  };

                  break;

                case "~":
                  o = function o(a) {
                    return a.getAttribute(p).match(RegExp("\\b" + A + "\\b"));
                  };

                  break;

                case "|":
                  o = function o(a) {
                    return a.getAttribute(p).match(RegExp("^" + A + "-?"));
                  };

                  break;

                case "^":
                  o = function o(a) {
                    return 0 === a.getAttribute(p).indexOf(A);
                  };

                  break;

                case "$":
                  o = function o(a) {
                    return a.getAttribute(p).lastIndexOf(A) == a.getAttribute(p).length - A.length;
                  };

                  break;

                case "*":
                  o = function o(a) {
                    return -1 < a.getAttribute(p).indexOf(A);
                  };

                  break;

                default:
                  o = function o(a) {
                    return a.getAttribute(p);
                  };

              }

              k = [];

              for (f = d = 0; f < j.length; f++) {
                o(j[f]) && (k[d++] = j[f]);
              }
            } else {
              j = [];

              for (f = l = 0; f < k.length; f++) {
                q = k[f].getElementsByTagName(d);

                for (h = 0; h < q.length; h++) {
                  j[l++] = q[h];
                }
              }

              k = j;
            }
          }

          return k;
        }

        var d = /[\t\r\n]/g;
        return function (a) {
          return c.gd(a) ? [a] : c.j(a) && !c.d(a.length) ? a : b.call(this, a);
        };
      }();

      c.info = {
        Qc: function Qc() {
          var a = "",
              b = {};
          c.a("utm_source utm_medium utm_campaign utm_content utm_term".split(" "), function (d) {
            a = c.Jb(v.URL, d);
            a.length && (b[d] = a);
          });
          return b;
        },
        qd: function qd(a) {
          return 0 === a.search("https?://(.*)google.([^/?]*)") ? "google" : 0 === a.search("https?://(.*)bing.com") ? "bing" : 0 === a.search("https?://(.*)yahoo.com") ? "yahoo" : 0 === a.search("https?://(.*)duckduckgo.com") ? "duckduckgo" : n;
        },
        rd: function rd(a) {
          var b = c.info.qd(a),
              d = {};
          if (b !== n) d.$search_engine = b, a = c.Jb(a, "yahoo" != b ? "q" : "p"), a.length && (d.mp_keyword = a);
          return d;
        },
        ba: function ba(a, b, d) {
          return d || c.g(a, " OPR/") ? c.g(a, "Mini") ? "Opera Mini" : "Opera" : /(BlackBerry|PlayBook|BB10)/i.test(a) ? "BlackBerry" : c.g(a, "IEMobile") || c.g(a, "WPDesktop") ? "Internet Explorer Mobile" : c.g(a, "Edge") ? "Microsoft Edge" : c.g(a, "FBIOS") ? "Facebook Mobile" : c.g(a, "Chrome") ? "Chrome" : c.g(a, "CriOS") ? "Chrome iOS" : c.g(a, "FxiOS") ? "Firefox iOS" : c.g(b || "", "Apple") ? c.g(a, "Mobile") ? "Mobile Safari" : "Safari" : c.g(a, "Android") ? "Android Mobile" : c.g(a, "Konqueror") ? "Konqueror" : c.g(a, "Firefox") ? "Firefox" : c.g(a, "MSIE") || c.g(a, "Trident/") ? "Internet Explorer" : c.g(a, "Gecko") ? "Mozilla" : "";
        },
        Db: function Db(a, b, d) {
          b = {
            "Internet Explorer Mobile": /rv:(\d+(\.\d+)?)/,
            "Microsoft Edge": /Edge\/(\d+(\.\d+)?)/,
            Chrome: /Chrome\/(\d+(\.\d+)?)/,
            "Chrome iOS": /CriOS\/(\d+(\.\d+)?)/,
            Safari: /Version\/(\d+(\.\d+)?)/,
            "Mobile Safari": /Version\/(\d+(\.\d+)?)/,
            Opera: /(Opera|OPR)\/(\d+(\.\d+)?)/,
            Firefox: /Firefox\/(\d+(\.\d+)?)/,
            "Firefox iOS": /FxiOS\/(\d+(\.\d+)?)/,
            Konqueror: /Konqueror:(\d+(\.\d+)?)/,
            BlackBerry: /BlackBerry (\d+(\.\d+)?)/,
            "Android Mobile": /android\s(\d+(\.\d+)?)/,
            "Internet Explorer": /(rv:|MSIE )(\d+(\.\d+)?)/,
            Mozilla: /rv:(\d+(\.\d+)?)/
          }[c.info.ba(a, b, d)];
          if (void 0 === b) return n;
          a = a.match(b);
          return !a ? n : parseFloat(a[a.length - 2]);
        },
        fb: function fb() {
          return /Windows/i.test(t) ? /Phone/.test(t) || /WPDesktop/.test(t) ? "Windows Phone" : "Windows" : /(iPhone|iPad|iPod)/.test(t) ? "iOS" : /Android/.test(t) ? "Android" : /(BlackBerry|PlayBook|BB10)/i.test(t) ? "BlackBerry" : /Mac/i.test(t) ? "Mac OS X" : /Linux/.test(t) ? "Linux" : "";
        },
        Hb: function Hb(a) {
          return /Windows Phone/i.test(a) || /WPDesktop/.test(a) ? "Windows Phone" : /iPad/.test(a) ? "iPad" : /iPod/.test(a) ? "iPod Touch" : /iPhone/.test(a) ? "iPhone" : /(BlackBerry|PlayBook|BB10)/i.test(a) ? "BlackBerry" : /Android/.test(a) ? "Android" : "";
        },
        Ub: function Ub(a) {
          a = a.split("/");
          return 3 <= a.length ? a[2] : "";
        },
        ha: function ha() {
          return c.extend(c.za({
            $os: c.info.fb(),
            $browser: c.info.ba(t, F.vendor, window.opera),
            $referrer: v.referrer,
            $referring_domain: c.info.Ub(v.referrer),
            $device: c.info.Hb(t)
          }), {
            $current_url: window.location.href,
            $browser_version: c.info.Db(t, F.vendor, window.opera),
            $screen_height: screen.height,
            $screen_width: screen.width,
            mp_lib: "web",
            $lib_version: "2.9.14"
          });
        },
        md: function md() {
          return c.extend(c.za({
            $os: c.info.fb(),
            $browser: c.info.ba(t, F.vendor, window.opera)
          }), {
            $browser_version: c.info.Db(t, F.vendor, window.opera)
          });
        },
        ld: function ld(a) {
          return c.za({
            mp_page: a,
            mp_referrer: v.referrer,
            mp_browser: c.info.ba(t, F.vendor, window.opera),
            mp_platform: c.info.fb()
          });
        }
      };
      c.toArray = c.ja;
      c.isObject = c.j;
      c.JSONEncode = c.na;
      c.JSONDecode = c.ma;
      c.isBlockedUA = c.Ob;
      c.isEmptyObject = c.V;
      c.info = c.info;
      c.info.device = c.info.Hb;
      c.info.browser = c.info.ba;
      c.info.properties = c.info.ha;
      var C = {
        tb: [],
        Hc: function Hc(a) {
          if (a.previousElementSibling) return a.previousElementSibling;

          do {
            a = a.previousSibling;
          } while (a && 1 !== a.nodeType);

          return a;
        },
        Ec: function Ec(a, b) {
          var c = document.createElement("script");
          c.type = "text/javascript";
          c.src = a;
          c.onload = b;
          var e = document.getElementsByTagName("script");
          0 < e.length ? e[0].parentNode.insertBefore(c, e[0]) : document.body.appendChild(c);
        },
        qa: function qa(a) {
          return "svg" === a.tagName.toLowerCase() ? a.className.Md || a.getAttribute("class") || "" : a.className || "";
        },
        xc: function xc(a) {
          var b = {
            classes: this.qa(a).split(" "),
            tag_name: a.tagName.toLowerCase()
          };

          if (c.g(["input", "select", "textarea"], a.tagName.toLowerCase())) {
            var d = this.qb(a);
            this.Ma(a, d) && (b.value = d);
          }

          c.a(a.attributes, function (a) {
            b["attr__" + a.name] = a.value;
          });

          for (var e = d = 1, g = a; g = this.Hc(g);) {
            d++, g.tagName === a.tagName && e++;
          }

          b.nth_child = d;
          b.nth_of_type = e;
          return b;
        },
        Jc: function Jc(a, b) {
          if (!a || a === document || a === document.body.parentNode || 1 !== a.nodeType) return r;

          switch (a.tagName.toLowerCase()) {
            case "html":
              return r;

            case "form":
              return "submit" === b.type;

            case "input":
              return -1 === ["button", "submit"].indexOf(a.getAttribute("type")) ? "change" === b.type : "click" === b.type;

            case "select":
            case "textarea":
              return "change" === b.type;

            default:
              return "click" === b.type;
          }
        },
        pb: function pb(a) {
          return {
            $event_type: a,
            $ce_version: 1,
            $host: window.location.host,
            $pathname: window.location.pathname
          };
        },
        wc: function wc(a) {
          var b = n;

          switch (a.type.toLowerCase()) {
            case "checkbox":
              a.checked && (b = [a.value]);
              break;

            case "radio":
              if (a.checked) b = a.value;
              break;

            default:
              b = a.value;
          }

          return b;
        },
        yc: function yc(a) {
          if (a.multiple) {
            var b = [];
            c.a(a.querySelectorAll("[selected]"), function (a) {
              b.push(a.value);
            });
            a = b;
          } else a = a.value;

          return a;
        },
        Ma: function Ma(a, b) {
          for (var d = a; d.parentNode && d !== document.body; d = d.parentNode) {
            var e = this.qa(d).split(" ");
            if (c.g(e, "mp-sensitive") || c.g(e, "mp-no-track")) return r;
          }

          if (c.g(this.qa(a).split(" "), "mp-include")) return m;
          if (b === n) return r;

          switch ((a.type || "").toLowerCase()) {
            case "hidden":
              return r;

            case "password":
              return r;
          }

          return /^cc|cardnum|ccnum|creditcard|csc|cvc|cvv|exp|pass|seccode|securitycode|securitynum|socialsec|socsec|ssn/i.test((a.name || a.id || "").replace(/[^a-zA-Z0-9]/g, "")) || "string" === typeof b && (/^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/.test((b || "").replace(/[\- ]/g, "")) || /(^\d{3}-?\d{2}-?\d{4}$)/.test(b)) ? r : m;
        },
        qb: function qb(a) {
          var b;

          switch (a.tagName.toLowerCase()) {
            case "input":
              b = this.wc(a);
              break;

            case "select":
              b = this.yc(a);
              break;

            default:
              b = a.value || a.textContent;
          }

          return this.Ma(a, b) ? b : n;
        },
        vc: function vc(a) {
          var b = {};
          c.a(a.elements, function (a) {
            var c = a.getAttribute("name") || a.getAttribute("id");

            if (c !== n) {
              var c = "$form_field__" + c,
                  g = this.qb(a);
              this.Ma(a, g) && (a = b[c], b[c] = void 0 !== a ? [].concat(a, g) : g);
            }
          }, this);
          return b;
        },
        rc: function rc(a) {
          var b = [];
          c.a(document.querySelectorAll(a.css_selector), function (a) {
            -1 < ["input", "select"].indexOf(a.tagName.toLowerCase()) ? b.push(a.value) : a.textContent && b.push(a.textContent);
          });
          return b.join(", ");
        },
        tc: function tc(a) {
          var b = {};
          c.a(this.lb, function (d) {
            c.a(d.event_selectors, function (e) {
              e = document.querySelectorAll(e);
              c.a(e, function (e) {
                c.g(a, e) && (b[d.name] = this.rc(d));
              }, this);
            }, this);
          }, this);
          return b;
        },
        Rc: function Rc(a) {
          a = parseInt(a.getResponseHeader("X-MP-CE-Backoff"));

          if (!isNaN(a) && 0 < a) {
            var b = c.timestamp() + 1E3 * a;
            console.log("disabling CE for " + a + " seconds (from " + c.timestamp() + " until " + b + ")");
            c.cookie.vd("__mpced", m, a, m);
          }
        },
        uc: function uc(a) {
          return "undefined" === typeof a.target ? a.srcElement : a.target;
        },
        Lc: function Lc(a, b) {
          var d = this.uc(a);
          if (3 === d.nodeType) d = d.parentNode;

          if (this.Jc(d, a)) {
            for (var e = [d]; d.parentNode && d !== document.body;) {
              e.push(d.parentNode), d = d.parentNode;
            }

            var g = [],
                j,
                f,
                i,
                h = r;
            c.a(e, function (a, b) {
              "a" === a.tagName.toLowerCase() ? j = a.getAttribute("href") : "form" === a.tagName.toLowerCase() && (i = a);

              if (!f && 5 > b && a.textContent) {
                var d = c.trim(a.textContent);
                d && (f = d.replace(/[\r\n]/g, " ").replace(/[ ]+/g, " ").substring(0, 255));
              }

              d = this.qa(a).split(" ");
              c.g(d, "mp-no-track") && (h = m);
              g.push(this.xc(a));
            }, this);
            if (h) return r;
            e = c.extend(this.pb(a.type), {
              $elements: g,
              $el_attr__href: j,
              $el_text: f
            }, this.tc(e));
            i && ("submit" === a.type || "click" === a.type) && c.extend(e, this.vc(i));
            b.J("$web_event", e);
            return m;
          }
        },
        Kd: function Kd(a) {
          window.location.href = a;
        },
        mc: function mc(a) {
          var b = c.bind(function (b) {
            c.cookie.parse("__mpced") !== m && (b = b || window.event, this.Lc(b, a));
          }, this);
          c.o(document, "submit", b, r, m);
          c.o(document, "change", b, r, m);
          c.o(document, "click", b, r, m);
        },
        lb: {},
        U: function U(a) {
          if (!document || !document.body) {
            console.log("document not ready yet, trying again in 500 milliseconds...");
            var b = this;
            setTimeout(function () {
              b.U(a);
            }, 500);
          } else {
            var d = a.c("token");
            if (-1 < this.tb.indexOf(d)) console.log('autotrack already initialized for token "' + d + '"');else if (this.tb.push(d), !this.Fc(a)) {
              var e = c.bind(function (b) {
                if (b && b.config && b.config.enable_collect_everything === m) {
                  if (b.custom_properties) this.lb = b.custom_properties;
                  a.J("$web_event", c.extend({
                    $title: document.title
                  }, this.pb("pageview")));
                  this.mc(a);
                } else a.__autotrack_enabled = r;
              }, this);
              a.p(a.c("decide_host") + "/decide/", {
                verbose: m,
                version: "1",
                lib: "web",
                token: d
              }, a.ta(e));
            }
          }
        },
        nb: function nb(a, b) {
          var d;

          try {
            var e = c.ea(b, "state"),
                e = JSON.parse(decodeURIComponent(e)),
                g = c.ea(b, "expires_in");
            d = {
              accessToken: c.ea(b, "access_token"),
              accessTokenExpiresAt: new Date().getTime() + 1E3 * Number(g),
              appHost: e.appHost,
              bookmarkletMode: !!e.bookmarkletMode,
              projectId: e.projectId,
              projectOwnerId: e.projectOwnerId,
              projectToken: e.token,
              readOnly: e.readOnly,
              userFlags: e.userFlags,
              userId: e.userId
            };
            window.sessionStorage.setItem("editorParams", JSON.stringify(d));
            e.desiredHash ? window.location.hash = e.desiredHash : window.history ? history.replaceState("", document.title, window.location.pathname + window.location.search) : window.location.hash = "";
          } catch (j) {
            console.error("Unable to parse data from hash", j);
          }

          return d;
        },
        Fc: function Fc(a) {
          var b = r;
          c.ea(window.location.hash, "state") && (b = c.ea(window.location.hash, "state"), b = JSON.parse(decodeURIComponent(b)), b = "mpeditor" === b.action);
          var d = !!window.sessionStorage.getItem("_mpcehash");
          b ? b = this.nb(a, window.location.hash) : d ? (b = this.nb(a, window.sessionStorage.getItem("_mpcehash")), window.sessionStorage.removeItem("_mpcehash")) : b = JSON.parse(window.sessionStorage.getItem("editorParams") || "{}");
          return b.projectToken && a.c("token") === b.projectToken ? (this.Dc(a, b), m) : r;
        },
        mb: r,
        Dc: function Dc(a, b) {
          if (!this.mb) {
            this.mb = m;
            var c = "?_ts=" + new Date().getTime(),
                e = a.c("app_host") + "/site_media";
            this.Ec(z ? e + "/compiled/reports/collect-everything/editor.js" + c : e + "/bundle-webpack/reports/collect-everything/editor.min.js" + c, function () {
              window.mp_load_editor(b);
            });
            return m;
          }

          return r;
        },
        $c: function $c(a, b, d) {
          for (var b = !c.d(b) ? b : 10, d = !c.d(d) ? d : 10, e = 0, g = 0; g < a.length; g++) {
            e += a.charCodeAt(g);
          }

          return e % b < d;
        },
        ed: function ed() {
          return c.ab(document.querySelectorAll);
        }
      };
      c.Cb(C);
      c.pd(C);
      var L,
          s,
          Z = "__mps,__mpso,__mpa,__mpap,__mpu,$people_distinct_id,__alias,__cmpns,__timers".split(",");
      w = "https:" === document.location.protocol ? "https://" : "http://";
      var K = window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest(),
          R = !K && -1 === t.indexOf("MSIE") && -1 === t.indexOf("Mozilla"),
          P = {
        api_host: w + "api.mixpanel.com",
        app_host: w + "mixpanel.com",
        autotrack: m,
        cdn: w + "cdn.mxpnl.com",
        cross_subdomain_cookie: m,
        persistence: "cookie",
        persistence_name: "",
        cookie_name: "",
        loaded: B(),
        store_google: m,
        save_referrer: m,
        test: r,
        verbose: r,
        img: r,
        track_pageview: m,
        debug: r,
        track_links_timeout: 300,
        cookie_expiration: 365,
        upgrade: r,
        disable_persistence: r,
        disable_cookie: r,
        secure_cookie: r,
        ip: m,
        property_blacklist: []
      };
      P.decide_host = P.api_host;
      var Q = r;
      x.prototype.wa = B();
      x.prototype.Va = B();
      x.prototype.Ra = B();

      x.prototype.U = function (a) {
        this.Rb = a;
        return this;
      };

      x.prototype.J = function (a, b, d, e) {
        var g = this,
            j = c.Yc(a);
        if (0 === j.length) k.error("The DOM query (" + a + ") returned 0 elements");else return c.a(j, function (a) {
          c.o(a, this.Tb, function (a) {
            var c = {},
                j = g.wa(d, this),
                f = g.Rb.c("track_links_timeout");
            g.Va(a, this, c);
            window.setTimeout(g.$b(e, j, c, m), f);
            g.Rb.J(b, j, g.$b(e, j, c));
          });
        }, this), m;
      };

      x.prototype.$b = function (a, b, c, e) {
        var e = e || r,
            g = this;
        return function () {
          if (!c.Pc) c.Pc = m, a && a(e, b) === r || g.Ra(b, c, e);
        };
      };

      x.prototype.wa = function (a, b) {
        return "function" === typeof a ? a(b) : c.extend({}, a);
      };

      c.Nb(D, x);

      D.prototype.wa = function (a, b) {
        var c = D.zd.wa.apply(this, arguments);
        if (b.href) c.url = b.href;
        return c;
      };

      D.prototype.Va = function (a, b, c) {
        c.Sb = 2 === a.which || a.metaKey || a.ctrlKey || "_blank" === b.target;
        c.href = b.href;
        c.Sb || a.preventDefault();
      };

      D.prototype.Ra = function (a, b) {
        b.Sb || setTimeout(function () {
          window.location = b.href;
        }, 0);
      };

      c.Nb(I, x);

      I.prototype.Va = function (a, b, c) {
        c.element = b;
        a.preventDefault();
      };

      I.prototype.Ra = function (a, b) {
        setTimeout(function () {
          b.element.submit();
        }, 0);
      };

      o.prototype.ha = function () {
        var a = {};
        c.a(this.props, function (b, d) {
          c.Lb(Z, d) || (a[d] = b);
        });
        return a;
      };

      o.prototype.load = function () {
        if (!this.disabled) {
          var a = this.w.parse(this.name);
          a && (this.props = c.extend({}, a));
        }
      };

      o.prototype.Fd = function (a) {
        var b = a.upgrade,
            d;
        if (b) d = "mp_super_properties", "string" === typeof b && (d = b), b = this.w.parse(d), this.w.remove(d), this.w.remove(d, m), b && (this.props = c.extend(this.props, b.all, b.events));
        if (!a.cookie_name && "mixpanel" !== a.name && (d = "mp_" + a.token + "_" + a.name, b = this.w.parse(d))) this.w.remove(d), this.w.remove(d, m), this.G(b);
        this.w === c.localStorage && (b = c.cookie.parse(this.name), c.cookie.remove(this.name), c.cookie.remove(this.name, m), b && this.G(b));
      };

      o.prototype.save = function () {
        this.disabled || (this.qc(), this.w.set(this.name, c.na(this.props), this.Wa, this.Ta, this.Vb));
      };

      o.prototype.remove = function () {
        this.w.remove(this.name, r);
        this.w.remove(this.name, m);
      };

      o.prototype.clear = function () {
        this.remove();
        this.props = {};
      };

      o.prototype.G = function (a, b, d) {
        return c.j(a) ? ("undefined" === typeof b && (b = "None"), this.Wa = "undefined" === typeof d ? this.Gb : d, c.a(a, function (a, c) {
          if (!this.props[c] || this.props[c] === b) this.props[c] = a;
        }, this), this.save(), m) : r;
      };

      o.prototype.ia = function (a, b) {
        return c.j(a) ? (this.Wa = "undefined" === typeof b ? this.Gb : b, c.extend(this.props, a), this.save(), m) : r;
      };

      o.prototype.Ca = function (a) {
        a in this.props && (delete this.props[a], this.save());
      };

      o.prototype.qc = c.l(function () {
        var a = this.props.__cmpns,
            b = z ? 6E4 : 36E5;

        if (a) {
          for (var d in a) {
            1 * new Date() - a[d] > b && delete a[d];
          }

          c.V(a) && delete this.props.__cmpns;
        }
      });

      o.prototype.Ed = function () {
        if (!this.Eb) this.G(c.info.Qc()), this.Eb = m;
      };

      o.prototype.dc = function (a) {
        this.ia(c.info.rd(a));
      };

      o.prototype.ib = function (a) {
        this.G({
          $initial_referrer: a || "$direct",
          $initial_referring_domain: c.info.Ub(a) || "$direct"
        }, "");
      };

      o.prototype.cd = function () {
        return c.za({
          $initial_referrer: this.props.$initial_referrer,
          $initial_referring_domain: this.props.$initial_referring_domain
        });
      };

      o.prototype.cc = function (a) {
        this.Gb = this.Wa = a.cookie_expiration;
        this.td(a.disable_persistence);
        this.sd(a.cross_subdomain_cookie);
        this.wd(a.secure_cookie);
      };

      o.prototype.td = function (a) {
        (this.disabled = a) && this.remove();
      };

      o.prototype.sd = function (a) {
        if (a !== this.Ta) this.Ta = a, this.remove(), this.save();
      };

      o.prototype.bd = function () {
        return this.Ta;
      };

      o.prototype.wd = function (a) {
        if (a !== this.Vb) this.Vb = a ? m : r, this.remove(), this.save();
      };

      o.prototype.B = function (a, b) {
        var d = this.La(a),
            e = b[a],
            g = this.Z("$set"),
            j = this.Z("$set_once"),
            f = this.Z("$add"),
            i = this.Z("$union"),
            h = this.Z("$append", []);
        "__mps" === d ? (c.extend(g, e), this.S("$add", e), this.S("$union", e)) : "__mpso" === d ? c.a(e, function (a, b) {
          b in j || (j[b] = a);
        }) : "__mpa" === d ? c.a(e, function (a, b) {
          b in g ? g[b] += a : (b in f || (f[b] = 0), f[b] += a);
        }, this) : "__mpu" === d ? c.a(e, function (a, b) {
          c.isArray(a) && (b in i || (i[b] = []), i[b] = i[b].concat(a));
        }) : "__mpap" === d && h.push(e);
        k.log("MIXPANEL PEOPLE REQUEST (QUEUED, PENDING IDENTIFY):");
        k.log(b);
        this.save();
      };

      o.prototype.S = function (a, b) {
        var d = this.R(a);
        c.d(d) || (c.a(b, function (a, b) {
          delete d[b];
        }, this), this.save());
      };

      o.prototype.La = function (a) {
        if ("$set" === a) return "__mps";
        if ("$set_once" === a) return "__mpso";
        if ("$add" === a) return "__mpa";
        if ("$append" === a) return "__mpap";
        if ("$union" === a) return "__mpu";
        k.error("Invalid queue:", a);
      };

      o.prototype.R = function (a) {
        return this.props[this.La(a)];
      };

      o.prototype.Z = function (a, b) {
        var d = this.La(a),
            b = c.d(b) ? {} : b;
        return this.props[d] || (this.props[d] = b);
      };

      o.prototype.ud = function (a) {
        var b = this.props.__timers || {};
        b[a] = new Date().getTime();
        this.props.__timers = b;
        this.save();
      };

      o.prototype.nd = function (a) {
        var b = (this.props.__timers || {})[a];
        c.d(b) || (delete this.props.__timers[a], this.save());
        return b;
      };

      var f;

      h.prototype.U = function (a, b, d) {
        if (c.d(d)) k.error("You must name your new library: init(token, config, name)");else if ("mixpanel" === d) k.error("You must initialize the main mixpanel object right after you include the Mixpanel js snippet");else return a = H(a, b, d), s[d] = a, a.sa(), a;
      };

      h.prototype.Na = function (a, b, d) {
        this.__loaded = m;
        this.config = {};
        this.Wb(c.extend({}, P, b, {
          name: d,
          token: a,
          callback_fn: ("mixpanel" === d ? d : "mixpanel." + d) + "._jsc"
        }));
        this._jsc = B();
        this.Ia = [];
        this.Ja = [];
        this.Ha = [];
        this.P = {
          disable_all_events: r,
          identify_called: r
        };
        this.persistence = this.cookie = new o(this.config);
        this.G({
          distinct_id: c.jb()
        }, "");
      };

      h.prototype.sa = function () {
        this.c("loaded")(this);
        this.c("track_pageview") && this.ac();
      };

      h.prototype.oc = function () {
        c.a(this.Ia, function (a) {
          this.Pa.apply(this, a);
        }, this);
        c.a(this.Ja, function (a) {
          this.p.apply(this, a);
        }, this);
        delete this.Ia;
        delete this.Ja;
      };

      h.prototype.Pa = function (a, b) {
        if (this.c("img")) return k.error("You can't use DOM tracking functions with img = true."), r;
        if (!Q) return this.Ia.push([a, b]), r;
        var c = new a().U(this);
        return c.J.apply(c, b);
      };

      h.prototype.ta = function (a, b) {
        if (c.d(a)) return n;
        if (K) return function (c) {
          a(c, b);
        };
        var d = this._jsc,
            e = "" + Math.floor(1E8 * Math.random()),
            g = this.c("callback_fn") + "[" + e + "]";

        d[e] = function (c) {
          delete d[e];
          a(c, b);
        };

        return g;
      };

      h.prototype.p = function (a, b, d) {
        if (R) this.Ja.push(arguments);else {
          var e = this.c("verbose");
          b.verbose && (e = m);
          this.c("test") && (b.test = 1);
          e && (b.verbose = 1);
          this.c("img") && (b.img = 1);
          if (!K) if (d) b.callback = d;else if (e || this.c("test")) b.callback = "(function(){})";
          b.ip = this.c("ip") ? 1 : 0;
          b._ = new Date().getTime().toString();
          a += "?" + c.ic(b);

          if ("img" in b) {
            var g = document.createElement("img");
            g.src = a;
            document.body.appendChild(g);
          } else if (K) try {
            var j = new XMLHttpRequest();
            j.open("GET", a, m);
            j.withCredentials = m;

            j.onreadystatechange = function () {
              if (4 === j.readyState) if (-1 !== a.indexOf("api.mixpanel.com/track") && C.Rc(j), 200 === j.status) d && (e ? d(c.ma(j.responseText)) : d(Number(j.responseText)));else {
                var b = "Bad HTTP status: " + j.status + " " + j.statusText;
                k.error(b);
                d && (e ? d({
                  status: 0,
                  error: b
                }) : d(0));
              }
            };

            j.send(n);
          } catch (f) {
            k.error(f);
          } else {
            g = document.createElement("script");
            g.type = "text/javascript";
            g.async = m;
            g.defer = m;
            g.src = a;
            var i = document.getElementsByTagName("script")[0];
            i.parentNode.insertBefore(g, i);
          }
        }
      };

      h.prototype.Ka = function (a) {
        function b(a, b) {
          c.a(a, function (a) {
            this[a[0]].apply(this, a.slice(1));
          }, b);
        }

        var d,
            e = [],
            g = [],
            j = [];
        c.a(a, function (a) {
          a && (d = a[0], "function" === typeof a ? a.call(this) : c.isArray(a) && "alias" === d ? e.push(a) : c.isArray(a) && -1 !== d.indexOf("track") && "function" === typeof this[d] ? j.push(a) : g.push(a));
        }, this);
        b(e, this);
        b(g, this);
        b(j, this);
      };

      h.prototype.push = function (a) {
        this.Ka([a]);
      };

      h.prototype.disable = function (a) {
        "undefined" === typeof a ? this.P.Vc = m : this.Ha = this.Ha.concat(a);
      };

      h.prototype.J = function (a, b, d) {
        "function" !== typeof d && (d = B());
        if (c.d(a)) k.error("No event name provided to mixpanel.track");else if (this.ob(a)) d(0);else {
          b = b || {};
          b.token = this.c("token");
          var e = this.persistence.nd(a);
          c.d(e) || (b.$duration = parseFloat(((new Date().getTime() - e) / 1E3).toFixed(3)));
          this.persistence.dc(document.referrer);
          this.c("store_google") && this.persistence.Ed();
          this.c("save_referrer") && this.persistence.ib(document.referrer);
          b = c.extend({}, c.info.ha(), this.persistence.ha(), b);

          try {
            if (this.c("autotrack") && "mp_page_view" !== a && "$create_alias" !== a) b = c.extend({}, b, this.F), this.F = {
              $__c: 0
            }, c.cookie.set("mp_" + this.c("name") + "__c", 0, 1, m);
          } catch (g) {
            k.error(g);
          }

          e = this.c("property_blacklist");
          c.isArray(e) ? c.a(e, function (a) {
            delete b[a];
          }) : k.error("Invalid value for property_blacklist config: " + e);
          a = c.truncate({
            event: a,
            properties: b
          }, 255);
          e = c.na(a);
          e = c.Ab(e);
          k.log("MIXPANEL REQUEST:");
          k.log(a);
          this.p(this.c("api_host") + "/track/", {
            data: e
          }, this.ta(d, a));
          return a;
        }
      };

      h.prototype.ac = function (a) {
        if (c.d(a)) a = document.location.href;
        this.J("mp_page_view", c.info.ld(a));
      };

      h.prototype.Dd = function () {
        return this.Pa.call(this, D, arguments);
      };

      h.prototype.Cd = function () {
        return this.Pa.call(this, I, arguments);
      };

      h.prototype.Ad = function (a) {
        c.d(a) ? k.error("No event name provided to mixpanel.time_event") : this.ob(a) || this.persistence.ud(a);
      };

      h.prototype.ia = function (a, b) {
        this.persistence.ia(a, b);
      };

      h.prototype.G = function (a, b, c) {
        this.persistence.G(a, b, c);
      };

      h.prototype.Ca = function (a) {
        this.persistence.Ca(a);
      };

      h.prototype.Oa = function (a, b) {
        var c = {};
        c[a] = b;
        this.ia(c);
      };

      h.prototype.Ya = function (a, b, c, e, g, j) {
        a !== this.T() && a !== this.xa("__alias") && (this.Ca("__alias"), this.Oa("distinct_id", a));
        this.kb(this.T());
        this.P.Za = m;
        this.people.sc(b, c, e, g, j);
      };

      h.prototype.reset = function () {
        this.persistence.clear();
        this.P.Za = r;
        this.G({
          distinct_id: c.jb()
        }, "");
      };

      h.prototype.T = function () {
        return this.xa("distinct_id");
      };

      h.prototype.Nc = function (a, b) {
        if (a === this.xa("$people_distinct_id")) return k.ca("Attempting to create alias for existing People user - aborting."), -2;
        var d = this;
        c.d(b) && (b = this.T());
        if (a !== b) return this.Oa("__alias", a), this.J("$create_alias", {
          alias: a,
          distinct_id: b
        }, function () {
          d.Ya(a);
        });
        k.error("alias matches current distinct_id - skipping api call.");
        this.Ya(a);
        return -1;
      };

      h.prototype.jd = function (a) {
        this.Oa("mp_name_tag", a);
      };

      h.prototype.Wb = function (a) {
        if (c.j(a)) c.extend(this.config, a), this.c("persistence_name") || (this.config.persistence_name = this.config.cookie_name), this.c("disable_persistence") || (this.config.disable_persistence = this.config.disable_cookie), this.persistence && this.persistence.cc(this.config), z = z || this.c("debug");
      };

      h.prototype.c = function (a) {
        return this.config[a];
      };

      h.prototype.xa = function (a) {
        return this.persistence.props[a];
      };

      h.prototype.toString = function () {
        var a = this.c("name");
        "mixpanel" !== a && (a = "mixpanel." + a);
        return a;
      };

      h.prototype.ob = function (a) {
        return c.Ob(t) || this.P.Vc || c.Lb(this.Ha, a);
      };

      h.prototype.kb = function (a) {
        if (a && !this.P.Za && !this.c("disable_notifications")) {
          k.log("MIXPANEL NOTIFICATION CHECK");
          var b = this;
          this.p(this.c("decide_host") + "/decide/", {
            verbose: m,
            version: "1",
            lib: "web",
            token: this.c("token"),
            distinct_id: a
          }, this.ta(function (a) {
            a.notifications && 0 < a.notifications.length && b.yb.call(b, a.notifications[0]);
          }));
        }
      };

      h.prototype.yb = function (a) {
        new f(a, this).show();
      };

      p.prototype.Na = function (a) {
        this.e = a;
      };

      p.prototype.set = function (a, b, d) {
        var e = {},
            g = {};
        c.j(a) ? (c.a(a, function (a, b) {
          this.$(b) || (g[b] = a);
        }, this), d = b) : g[a] = b;
        this.ra("save_referrer") && this.e.persistence.ib(document.referrer);
        g = c.extend({}, c.info.md(), this.e.persistence.cd(), g);
        e.$set = g;
        return this.p(e, d);
      };

      p.prototype.Xb = function (a, b, d) {
        var e = {},
            g = {};
        c.j(a) ? (c.a(a, function (a, b) {
          this.$(b) || (g[b] = a);
        }, this), d = b) : g[a] = b;
        e.$set_once = g;
        return this.p(e, d);
      };

      p.prototype.Mb = function (a, b, d) {
        var e = {},
            g = {};
        c.j(a) ? (c.a(a, function (a, b) {
          this.$(b) || (isNaN(parseFloat(a)) ? k.error("Invalid increment value passed to mixpanel.people.increment - must be a number") : g[b] = a);
        }, this), d = b) : (c.d(b) && (b = 1), g[a] = b);
        e.$add = g;
        return this.p(e, d);
      };

      p.prototype.append = function (a, b, d) {
        var e = {},
            g = {};
        c.j(a) ? (c.a(a, function (a, b) {
          this.$(b) || (g[b] = a);
        }, this), d = b) : g[a] = b;
        e.$append = g;
        return this.p(e, d);
      };

      p.prototype.bc = function (a, b, d) {
        var e = {},
            g = {};
        c.j(a) ? (c.a(a, function (a, b) {
          this.$(b) || (g[b] = c.isArray(a) ? a : [a]);
        }, this), d = b) : g[a] = c.isArray(b) ? b : [b];
        e.$union = g;
        return this.p(e, d);
      };

      p.prototype.Bd = function (a, b, d) {
        if (!c.hd(a) && (a = parseFloat(a), isNaN(a))) {
          k.error("Invalid value passed to mixpanel.people.track_charge - must be a number");
          return;
        }

        return this.append("$transactions", c.extend({
          $amount: a
        }, b), d);
      };

      p.prototype.Sc = function (a) {
        return this.set("$transactions", [], a);
      };

      p.prototype.Uc = function () {
        if (this.sb()) return this.p({
          $delete: this.e.T()
        });
        k.error("mixpanel.people.delete_user() requires you to call identify() first");
      };

      p.prototype.toString = function () {
        return this.e.toString() + ".people";
      };

      p.prototype.p = function (a, b) {
        a.$token = this.ra("token");
        a.$distinct_id = this.e.T();
        var d = c.Ib(a),
            e = c.truncate(d, 255),
            d = c.na(d),
            d = c.Ab(d);
        if (!this.sb()) return this.pc(a), c.d(b) || (this.ra("verbose") ? b({
          status: -1,
          error: n
        }) : b(-1)), e;
        k.log("MIXPANEL PEOPLE REQUEST:");
        k.log(e);
        this.e.p(this.ra("api_host") + "/engage/", {
          data: d
        }, this.e.ta(b, e));
        return e;
      };

      p.prototype.ra = function (a) {
        return this.e.c(a);
      };

      p.prototype.sb = function () {
        return this.e.P.Za === m;
      };

      p.prototype.pc = function (a) {
        "$set" in a ? this.e.persistence.B("$set", a) : "$set_once" in a ? this.e.persistence.B("$set_once", a) : "$add" in a ? this.e.persistence.B("$add", a) : "$append" in a ? this.e.persistence.B("$append", a) : "$union" in a ? this.e.persistence.B("$union", a) : k.error("Invalid call to _enqueue():", a);
      };

      p.prototype.sc = function (a, b, d, e, g) {
        var f = this,
            h = c.extend({}, this.e.persistence.R("$set")),
            i = c.extend({}, this.e.persistence.R("$set_once")),
            k = c.extend({}, this.e.persistence.R("$add")),
            o = this.e.persistence.R("$append"),
            q = c.extend({}, this.e.persistence.R("$union"));
        !c.d(h) && c.j(h) && !c.V(h) && (f.e.persistence.S("$set", h), this.set(h, function (b, d) {
          0 === b && f.e.persistence.B("$set", h);
          c.d(a) || a(b, d);
        }));
        !c.d(i) && c.j(i) && !c.V(i) && (f.e.persistence.S("$set_once", i), this.Xb(i, function (a, b) {
          0 === a && f.e.persistence.B("$set_once", i);
          c.d(e) || e(a, b);
        }));
        !c.d(k) && c.j(k) && !c.V(k) && (f.e.persistence.S("$add", k), this.Mb(k, function (a, d) {
          0 === a && f.e.persistence.B("$add", k);
          c.d(b) || b(a, d);
        }));
        !c.d(q) && c.j(q) && !c.V(q) && (f.e.persistence.S("$union", q), this.bc(q, function (a, b) {
          0 === a && f.e.persistence.B("$union", q);
          c.d(g) || g(a, b);
        }));

        if (!c.d(o) && c.isArray(o) && o.length) {
          for (var p, s = function s(a, b) {
            0 === a && f.e.persistence.B("$append", p);
            c.d(d) || d(a, b);
          }, t = o.length - 1; 0 <= t; t--) {
            p = o.pop(), f.append(p, s);
          }

          f.e.persistence.save();
        }
      };

      p.prototype.$ = function (a) {
        return "$distinct_id" === a || "$token" === a;
      };

      h.lc = function (a, b) {
        c.Cb(this);
        this.eb = b;
        this.gb = this.eb.persistence;
        this.D = c.u(a.id);
        this.Qb = c.u(a.message_id);
        this.body = (c.u(a.body) || "").replace(/\n/g, "<br/>");
        this.Tc = c.u(a.cta) || "Close";
        this.da = c.u(a.cta_url) || n;
        this.$a = c.u(a.image_url) || n;
        this.fa = c.u(a.type) || "takeover";
        this.style = c.u(a.style) || "light";
        this.L = c.u(a.thumb_image_url) || n;
        this.title = c.u(a.title) || "";
        this.Da = c.u(a.video_url) || n;
        this.ka = f.kc;
        this.X = f.jc;
        this.va = m;
        if (!this.da) this.da = "#dismiss", this.va = r;
        this.v = "mini" === this.fa;
        if (!this.v) this.fa = "takeover";
        this.kd = !this.v ? f.Y : f.Ea;
        this.xb();
        this.ya = this.zc();
        this.Cc();
      };

      f = h.lc;
      f.M = 200;
      f.z = "mixpanel-notification";
      f.la = 0.6;
      f.I = 25;
      f.oa = 200;
      f.Y = 388;
      f.Ea = 420;
      f.A = 85;
      f.Fa = 5;
      f.K = 60;
      f.Ga = Math.round(f.K / 2);
      f.kc = 595;
      f.jc = 334;

      f.prototype.show = function () {
        var a = this;
        this.xb();
        this.q ? (this.Bc(), this.Ac(), this.Gc(this.nc)) : setTimeout(function () {
          a.show();
        }, 300);
      };

      f.prototype.Ua = c.l(function () {
        this.Pb || this.vb({
          invisible: m
        });
        var a = this.xd ? this.i("video") : this.Q();
        if (this.ec) this.Ic("bg", "visible"), this.N(a, "exiting"), setTimeout(this.wb, f.M);else {
          var b, c, e;
          this.v ? (b = "right", c = 20, e = -100) : (b = "top", c = f.I, e = f.oa + f.I);
          this.pa([{
            s: this.i("bg"),
            m: "opacity",
            start: f.la,
            k: 0
          }, {
            s: a,
            m: "opacity",
            start: 1,
            k: 0
          }, {
            s: a,
            m: b,
            start: c,
            k: e
          }], f.M, this.wb);
        }
      });
      f.prototype.N = c.l(function (a, b) {
        b = f.z + "-" + b;
        "string" === typeof a && (a = this.i(a));
        a.className ? ~(" " + a.className + " ").indexOf(" " + b + " ") || (a.className += " " + b) : a.className = b;
      });
      f.prototype.Ic = c.l(function (a, b) {
        b = f.z + "-" + b;
        "string" === typeof a && (a = this.i(a));
        if (a.className) a.className = (" " + a.className + " ").replace(" " + b + " ", "").replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, "");
      });
      f.prototype.pa = c.l(function (a, b, c, e) {
        var g = this,
            f = r,
            h,
            i;
        h = 1 * new Date();
        var k,
            e = e || h;
        k = h - e;

        for (h = 0; h < a.length; h++) {
          i = a[h];
          if ("undefined" === typeof i.H) i.H = i.start;

          if (i.H !== i.k) {
            var f = m,
                o = i.k >= i.start ? 1 : -1;
            i.H = i.start + (i.k - i.start) * k / b;
            if ("opacity" !== i.m) i.H = Math.round(i.H);
            if (0 < o && i.H >= i.k || 0 > o && i.H <= i.k) i.H = i.k;
          }
        }

        if (f) {
          for (h = 0; h < a.length; h++) {
            i = a[h], i.s && (i.s.style[i.m] = "" + i.H + ("opacity" === i.m ? "" : "px"));
          }

          setTimeout(function () {
            g.pa(a, b, c, e);
          }, 10);
        } else c && c();
      });
      f.prototype.nc = c.l(function () {
        var a = this;
        if (!this.yd && !this.rb()[this.D]) this.yd = m, this.q.appendChild(this.ga), setTimeout(function () {
          var b = a.Q();
          if (a.ec) a.v || a.N("bg", "visible"), a.N(b, "visible"), a.ub();else {
            var c, e, g;
            a.v ? (c = "right", e = -100, g = 20) : (c = "top", e = f.oa + f.I, g = f.I);
            a.pa([{
              s: a.i("bg"),
              m: "opacity",
              start: 0,
              k: f.la
            }, {
              s: b,
              m: "opacity",
              start: 0,
              k: 1
            }, {
              s: b,
              m: c,
              start: e,
              k: g
            }], f.M, a.ub);
          }
        }, 100), c.o(a.i("cancel"), "click", function (b) {
          b.preventDefault();
          a.Ua();
        }), c.o(a.i("button") || a.i("mini-content"), "click", function (b) {
          b.preventDefault();
          a.W ? (a.Qa("$campaign_open", {
            $resource_type: "video"
          }), a.Kc()) : (a.Ua(), a.va && a.Qa("$campaign_open", {
            $resource_type: "link"
          }, function () {
            window.location.href = a.da;
          }));
        });
      });

      f.prototype.i = function (a) {
        return document.getElementById(f.z + "-" + a);
      };

      f.prototype.Q = function () {
        return this.i(this.fa);
      };

      f.prototype.rb = function () {
        return this.gb.props.__cmpns || (this.gb.props.__cmpns = {});
      };

      f.prototype.O = function (a, b) {
        return this.C[a] && this.C[a] <= b;
      };

      f.prototype.zc = function () {
        var a = [];
        this.v ? (this.L = this.L || "//cdn.mxpnl.com/site_media/images/icons/notifications/mini-news-dark.png", a.push(this.L)) : (this.$a ? (a.push(this.$a), this.Kb = '<img id="img" src="' + this.$a + '"/>') : this.Kb = "", this.L ? (a.push(this.L), this.Zb = '<div id="thumbborder-wrapper"><div id="thumbborder"></div></div><img id="thumbnail" src="' + this.L + '" width="' + f.K + '" height="' + f.K + '"/><div id="thumbspacer"></div>') : this.Zb = "");
        return a;
      };

      f.prototype.Ac = function () {
        var a = "",
            b = "",
            c = "";
        this.ga = document.createElement("div");
        this.ga.id = f.z + "-wrapper";
        if (this.v) a = '<div id="mini"><div id="mainbox"><div id="cancel"><div id="cancel-icon"></div></div><div id="mini-content"><div id="mini-icon"><div id="mini-icon-img"></div></div><div id="body"><div id="body-text"><div>' + this.body + '</div></div></div></div></div><div id="mini-border"></div></div>';else {
          var a = this.va || this.W ? "" : '<div id="button-close"></div>',
              e = this.W ? '<div id="button-play"></div>' : "";
          this.O("ie", 7) && (e = a = "");
          a = '<div id="takeover">' + this.Zb + '<div id="mainbox"><div id="cancel"><div id="cancel-icon"></div></div><div id="content">' + this.Kb + '<div id="title">' + this.title + '</div><div id="body">' + this.body + '</div><div id="tagline"><a href="http://mixpanel.com?from=inapp" target="_blank">POWERED BY MIXPANEL</a></div></div><div id="button">' + a + '<a id="button-link" href="' + this.da + '">' + this.Tc + "</a>" + e + "</div></div></div>";
        }
        this.gc ? (b = "//www.youtube.com/embed/" + this.gc + "?wmode=transparent&showinfo=0&modestbranding=0&rel=0&autoplay=1&loop=0&vq=hd1080", this.hc && (b += "&enablejsapi=1&html5=1&controls=0", c = '<div id="video-controls"><div id="video-progress" class="video-progress-el"><div id="video-progress-total" class="video-progress-el"></div><div id="video-elapsed" class="video-progress-el"></div></div><div id="video-time" class="video-progress-el"></div></div>')) : this.fc && (b = "//player.vimeo.com/video/" + this.fc + "?autoplay=1&title=0&byline=0&portrait=0");
        if (this.W) this.Id = '<iframe id="' + f.z + '-video-frame" width="' + this.ka + '" height="' + this.X + '"  src="' + b + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen="1" scrolling="no"></iframe>', c = '<div id="video-' + (this.Xa ? "" : "no") + 'flip"><div id="video"><div id="video-holder"></div>' + c + "</div></div>";
        b = c + a;
        this.Xa && (b = (this.v ? a : "") + '<div id="flipcontainer"><div id="flipper">' + (this.v ? c : b) + "</div></div>");
        this.ga.innerHTML = ('<div id="overlay" class="' + this.fa + '"><div id="campaignid-' + this.D + '"><div id="bgwrapper"><div id="bg"></div>' + b + "</div></div></div>").replace(/class=\"/g, 'class="' + f.z + "-").replace(/id=\"/g, 'id="' + f.z + "-");
      };

      f.prototype.Bc = function () {
        this.h = "dark" === this.style ? {
          Sa: "#1d1f25",
          aa: "#282b32",
          ua: "#3a4147",
          Bb: "#4a5157",
          Oc: "#32353c",
          Fb: "0.4",
          cb: "#2a3137",
          Ba: "#fff",
          hb: "#9498a3",
          Yb: "#464851",
          Aa: "#ddd"
        } : {
          Sa: "#fff",
          aa: "#e7eaee",
          ua: "#eceff3",
          Bb: "#f5f5f5",
          Oc: "#e4ecf2",
          Fb: "1.0",
          cb: "#fafafa",
          Ba: "#5c6578",
          hb: "#8b949b",
          Yb: "#ced9e6",
          Aa: "#7c8598"
        };
        var a = "0px 0px 35px 0px rgba(45, 49, 56, 0.7)",
            b = a,
            d = a,
            e = f.K + 2 * f.Fa,
            g = f.M / 1E3 + "s";
        this.v && (a = "none");
        var j = {};
        j["@media only screen and (max-width: " + (f.Ea + 20 - 1) + "px)"] = {
          "#overlay": {
            display: "none"
          }
        };
        a = {
          ".flipped": {
            transform: "rotateY(180deg)"
          },
          "#overlay": {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            overflow: "auto",
            "text-align": "center",
            "z-index": "10000",
            "font-family": '"Helvetica", "Arial", sans-serif',
            "-webkit-font-smoothing": "antialiased",
            "-moz-osx-font-smoothing": "grayscale"
          },
          "#overlay.mini": {
            height: "0",
            overflow: "visible"
          },
          "#overlay a": {
            width: "initial",
            padding: "0",
            "text-decoration": "none",
            "text-transform": "none",
            color: "inherit"
          },
          "#bgwrapper": {
            position: "relative",
            width: "100%",
            height: "100%"
          },
          "#bg": {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            "min-width": 4 * this.Xc + "px",
            "min-height": 4 * this.Wc + "px",
            "background-color": "black",
            opacity: "0.0",
            "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)",
            filter: "alpha(opacity=60)",
            transition: "opacity " + g
          },
          "#bg.visible": {
            opacity: f.la
          },
          ".mini #bg": {
            width: "0",
            height: "0",
            "min-width": "0"
          },
          "#flipcontainer": {
            perspective: "1000px",
            position: "absolute",
            width: "100%"
          },
          "#flipper": {
            position: "relative",
            "transform-style": "preserve-3d",
            transition: "0.3s"
          },
          "#takeover": {
            position: "absolute",
            left: "50%",
            width: f.Y + "px",
            "margin-left": Math.round(-f.Y / 2) + "px",
            "backface-visibility": "hidden",
            transform: "rotateY(0deg)",
            opacity: "0.0",
            top: f.oa + "px",
            transition: "opacity " + g + ", top " + g
          },
          "#takeover.visible": {
            opacity: "1.0",
            top: f.I + "px"
          },
          "#takeover.exiting": {
            opacity: "0.0",
            top: f.oa + "px"
          },
          "#thumbspacer": {
            height: f.Ga + "px"
          },
          "#thumbborder-wrapper": {
            position: "absolute",
            top: -f.Fa + "px",
            left: f.Y / 2 - f.Ga - f.Fa + "px",
            width: e + "px",
            height: e / 2 + "px",
            overflow: "hidden"
          },
          "#thumbborder": {
            position: "absolute",
            width: e + "px",
            height: e + "px",
            "border-radius": e + "px",
            "background-color": this.h.aa,
            opacity: "0.5"
          },
          "#thumbnail": {
            position: "absolute",
            top: "0px",
            left: f.Y / 2 - f.Ga + "px",
            width: f.K + "px",
            height: f.K + "px",
            overflow: "hidden",
            "z-index": "100",
            "border-radius": f.K + "px"
          },
          "#mini": {
            position: "absolute",
            right: "20px",
            top: f.I + "px",
            width: this.kd + "px",
            height: 2 * f.A + "px",
            "margin-top": 20 - f.A + "px",
            "backface-visibility": "hidden",
            opacity: "0.0",
            transform: "rotateX(90deg)",
            transition: "opacity 0.3s, transform 0.3s, right 0.3s"
          },
          "#mini.visible": {
            opacity: "1.0",
            transform: "rotateX(0deg)"
          },
          "#mini.exiting": {
            opacity: "0.0",
            right: "-150px"
          },
          "#mainbox": {
            "border-radius": "4px",
            "box-shadow": a,
            "text-align": "center",
            "background-color": this.h.Sa,
            "font-size": "14px",
            color: this.h.hb
          },
          "#mini #mainbox": {
            height: f.A + "px",
            "margin-top": f.A + "px",
            "border-radius": "3px",
            transition: "background-color " + g
          },
          "#mini-border": {
            height: f.A + 6 + "px",
            width: f.Ea + 6 + "px",
            position: "absolute",
            top: "-3px",
            left: "-3px",
            "margin-top": f.A + "px",
            "border-radius": "6px",
            opacity: "0.25",
            "background-color": "#fff",
            "z-index": "-1",
            "box-shadow": d
          },
          "#mini-icon": {
            position: "relative",
            display: "inline-block",
            width: "75px",
            height: f.A + "px",
            "border-radius": "3px 0 0 3px",
            "background-color": this.h.aa,
            background: "linear-gradient(135deg, " + this.h.Bb + " 0%, " + this.h.aa + " 100%)",
            transition: "background-color " + g
          },
          "#mini:hover #mini-icon": {
            "background-color": this.h.cb
          },
          "#mini:hover #mainbox": {
            "background-color": this.h.cb
          },
          "#mini-icon-img": {
            position: "absolute",
            "background-image": "url(" + this.L + ")",
            width: "48px",
            height: "48px",
            top: "20px",
            left: "12px"
          },
          "#content": {
            padding: "30px 20px 0px 20px"
          },
          "#mini-content": {
            "text-align": "left",
            height: f.A + "px",
            cursor: "pointer"
          },
          "#img": {
            width: "328px",
            "margin-top": "30px",
            "border-radius": "5px"
          },
          "#title": {
            "max-height": "600px",
            overflow: "hidden",
            "word-wrap": "break-word",
            padding: "25px 0px 20px 0px",
            "font-size": "19px",
            "font-weight": "bold",
            color: this.h.Ba
          },
          "#body": {
            "max-height": "600px",
            "margin-bottom": "25px",
            overflow: "hidden",
            "word-wrap": "break-word",
            "line-height": "21px",
            "font-size": "15px",
            "font-weight": "normal",
            "text-align": "left"
          },
          "#mini #body": {
            display: "inline-block",
            "max-width": "250px",
            margin: "0 0 0 30px",
            height: f.A + "px",
            "font-size": "16px",
            "letter-spacing": "0.8px",
            color: this.h.Ba
          },
          "#mini #body-text": {
            display: "table",
            height: f.A + "px"
          },
          "#mini #body-text div": {
            display: "table-cell",
            "vertical-align": "middle"
          },
          "#tagline": {
            "margin-bottom": "15px",
            "font-size": "10px",
            "font-weight": "600",
            "letter-spacing": "0.8px",
            color: "#ccd7e0",
            "text-align": "left"
          },
          "#tagline a": {
            color: this.h.Yb,
            transition: "color " + g
          },
          "#tagline a:hover": {
            color: this.h.Aa
          },
          "#cancel": {
            position: "absolute",
            right: "0",
            width: "8px",
            height: "8px",
            padding: "10px",
            "border-radius": "20px",
            margin: "12px 12px 0 0",
            "box-sizing": "content-box",
            cursor: "pointer",
            transition: "background-color " + g
          },
          "#mini #cancel": {
            margin: "7px 7px 0 0"
          },
          "#cancel-icon": {
            width: "8px",
            height: "8px",
            overflow: "hidden",
            "background-image": "url(//cdn.mxpnl.com/site_media/images/icons/notifications/cancel-x.png)",
            opacity: this.h.Fb
          },
          "#cancel:hover": {
            "background-color": this.h.ua
          },
          "#button": {
            display: "block",
            height: "60px",
            "line-height": "60px",
            "text-align": "center",
            "background-color": this.h.aa,
            "border-radius": "0 0 4px 4px",
            overflow: "hidden",
            cursor: "pointer",
            transition: "background-color " + g
          },
          "#button-close": {
            display: "inline-block",
            width: "9px",
            height: "60px",
            "margin-right": "8px",
            "vertical-align": "top",
            "background-image": "url(//cdn.mxpnl.com/site_media/images/icons/notifications/close-x-" + this.style + ".png)",
            "background-repeat": "no-repeat",
            "background-position": "0px 25px"
          },
          "#button-play": {
            display: "inline-block",
            width: "30px",
            height: "60px",
            "margin-left": "15px",
            "background-image": "url(//cdn.mxpnl.com/site_media/images/icons/notifications/play-" + this.style + "-small.png)",
            "background-repeat": "no-repeat",
            "background-position": "0px 15px"
          },
          "a#button-link": {
            display: "inline-block",
            "vertical-align": "top",
            "text-align": "center",
            "font-size": "17px",
            "font-weight": "bold",
            overflow: "hidden",
            "word-wrap": "break-word",
            color: this.h.Ba,
            transition: "color " + g
          },
          "#button:hover": {
            "background-color": this.h.ua,
            color: this.h.Aa
          },
          "#button:hover a": {
            color: this.h.Aa
          },
          "#video-noflip": {
            position: "relative",
            top: 2 * -this.X + "px"
          },
          "#video-flip": {
            "backface-visibility": "hidden",
            transform: "rotateY(180deg)"
          },
          "#video": {
            position: "absolute",
            width: this.ka - 1 + "px",
            height: this.X + "px",
            top: f.I + "px",
            "margin-top": "100px",
            left: "50%",
            "margin-left": Math.round(-this.ka / 2) + "px",
            overflow: "hidden",
            "border-radius": "5px",
            "box-shadow": b,
            transform: "translateZ(1px)",
            transition: "opacity " + g + ", top " + g
          },
          "#video.exiting": {
            opacity: "0.0",
            top: this.X + "px"
          },
          "#video-holder": {
            position: "absolute",
            width: this.ka - 1 + "px",
            height: this.X + "px",
            overflow: "hidden",
            "border-radius": "5px"
          },
          "#video-frame": {
            "margin-left": "-1px",
            width: this.ka + "px"
          },
          "#video-controls": {
            opacity: "0",
            transition: "opacity 0.5s"
          },
          "#video:hover #video-controls": {
            opacity: "1.0"
          },
          "#video .video-progress-el": {
            position: "absolute",
            bottom: "0",
            height: "25px",
            "border-radius": "0 0 0 5px"
          },
          "#video-progress": {
            width: "90%"
          },
          "#video-progress-total": {
            width: "100%",
            "background-color": this.h.Sa,
            opacity: "0.7"
          },
          "#video-elapsed": {
            width: "0",
            "background-color": "#6cb6f5",
            opacity: "0.9"
          },
          "#video #video-time": {
            width: "10%",
            right: "0",
            "font-size": "11px",
            "line-height": "25px",
            color: this.h.hb,
            "background-color": "#666",
            "border-radius": "0 0 5px 0"
          }
        };
        this.O("ie", 8) && c.extend(a, {
          "* html #overlay": {
            position: "absolute"
          },
          "* html #bg": {
            position: "absolute"
          },
          "html, body": {
            height: "100%"
          }
        });
        this.O("ie", 7) && c.extend(a, {
          "#mini #body": {
            display: "inline",
            zoom: "1",
            border: "1px solid " + this.h.ua
          },
          "#mini #body-text": {
            padding: "20px"
          },
          "#mini #mini-icon": {
            display: "none"
          }
        });
        var b = "backface-visibility,border-radius,box-shadow,opacity,perspective,transform,transform-style,transition".split(","),
            d = ["khtml", "moz", "ms", "o", "webkit"],
            h;

        for (h in a) {
          for (e = 0; e < b.length; e++) {
            if (g = b[e], g in a[h]) for (var i = a[h][g], k = 0; k < d.length; k++) {
              a[h]["-" + d[k] + "-" + g] = i;
            }
          }
        }

        (function (a, b) {
          function c(a) {
            var b = "",
                d;

            for (d in a) {
              var e = d.replace(/#/g, "#" + f.z + "-").replace(/\./g, "." + f.z + "-"),
                  b = b + ("\n" + e + " {"),
                  e = a[d],
                  g;

              for (g in e) {
                b += g + ":" + e[g] + ";";
              }

              b += "}";
            }

            return b;
          }

          var d = c(a) + function (a) {
            var b = "",
                d;

            for (d in a) {
              b += "\n" + d + " {" + c(a[d]) + "\n}";
            }

            return b;
          }(b),
              e = document.head || document.getElementsByTagName("head")[0] || document.documentElement,
              g = document.createElement("style");

          e.appendChild(g);
          g.setAttribute("type", "text/css");
          g.styleSheet ? g.styleSheet.cssText = d : g.textContent = d;
        })(a, j);
      };

      f.prototype.Cc = c.l(function () {
        if (this.Da) {
          var a = this;
          a.hc = "postMessage" in window;
          a.da = a.Da;
          var b = a.Da.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i),
              c = a.Da.match(/vimeo\.com\/.*?(\d+)/i);

          if (b) {
            if (a.W = m, a.gc = b[1], a.hc) window.onYouTubeIframeAPIReady = function () {
              a.i("video-frame") && a.zb();
            }, b = document.createElement("script"), b.src = "//www.youtube.com/iframe_api", c = document.getElementsByTagName("script")[0], c.parentNode.insertBefore(b, c);
          } else if (c) a.W = m, a.fc = c[1];

          if (a.O("ie", 7) || a.O("firefox", 3)) a.W = r, a.va = m;
        }
      });
      f.prototype.ub = c.l(function () {
        function a(a, b) {
          var c = {};
          if (document.defaultView && document.defaultView.getComputedStyle) c = document.defaultView.getComputedStyle(a, n);else if (a.currentStyle) c = a.currentStyle;
          return c[b];
        }

        var b = this;
        c.o(b.i("bg"), "click", function () {
          b.Ua();
        });

        if (this.D) {
          var d = this.i("overlay");
          d && "hidden" !== a(d, "visibility") && "none" !== a(d, "display") && this.vb();
        }
      });
      f.prototype.vb = c.l(function (a) {
        if (!this.Pb) this.Pb = m, this.D && (this.rb()[this.D] = 1 * new Date(), this.gb.save()), this.Qa("$campaign_delivery", a), this.eb.people.append({
          $campaigns: this.D,
          $notifications: {
            campaign_id: this.D,
            message_id: this.Qb,
            type: "web",
            time: new Date()
          }
        });
      });

      f.prototype.Gc = function (a) {
        var b = this;
        if (0 === this.ya.length) a();else {
          for (var c = 0, e = [], g = function g() {
            c++;
            c === b.ya.length && a && (a(), a = n);
          }, f = 0; f < this.ya.length; f++) {
            var h = new Image();
            h.onload = g;
            h.src = this.ya[f];
            h.complete && g();
            e.push(h);
          }

          this.O("ie", 7) && setTimeout(function () {
            var b = m;

            for (f = 0; f < e.length; f++) {
              e[f].complete || (b = r);
            }

            b && a && (a(), a = n);
          }, 500);
        }
      };

      f.prototype.wb = c.l(function () {
        window.clearInterval(this.Mc);
        this.ga.style.visibility = "hidden";
        this.q.removeChild(this.ga);
      });

      f.prototype.xb = function () {
        function a(a) {
          if (a in e) return m;
          if (!c) for (var a = a[0].toUpperCase() + a.slice(1), a = ["O" + a, "Webkit" + a, "Moz" + a], b = 0; b < a.length; b++) {
            if (a[b] in e) return m;
          }
          return r;
        }

        function b(a) {
          return (a = navigator.userAgent.match(a)) && a[1];
        }

        this.C = {};
        this.C.chrome = b(/Chrome\/(\d+)/);
        this.C.firefox = b(/Firefox\/(\d+)/);
        this.C.ie = b(/MSIE (\d+).+/);
        !this.C.ie && !window.ActiveXObject && "ActiveXObject" in window && (this.C.ie = 11);
        if (this.q = document.body || document.getElementsByTagName("body")[0]) this.Xc = Math.max(this.q.scrollWidth, document.documentElement.scrollWidth, this.q.offsetWidth, document.documentElement.offsetWidth, this.q.clientWidth, document.documentElement.clientWidth), this.Wc = Math.max(this.q.scrollHeight, document.documentElement.scrollHeight, this.q.offsetHeight, document.documentElement.offsetHeight, this.q.clientHeight, document.documentElement.clientHeight);
        var c = this.C.ie,
            e = document.createElement("div").style;
        this.ec = this.q && a("transition") && a("transform");
        this.Xa = (33 <= this.C.chrome || 15 <= this.C.firefox) && this.q && a("backfaceVisibility") && a("perspective") && a("transform");
      };

      f.prototype.Kc = c.l(function () {
        function a() {
          window.YT && window.YT.loaded && b.zb();
          b.xd = m;
          b.Q().style.visibility = "hidden";
        }

        var b = this,
            c = [{
          s: b.Q(),
          m: "opacity",
          start: 1,
          k: 0
        }, {
          s: b.Q(),
          m: "top",
          start: f.I,
          k: -500
        }, {
          s: b.i("video-noflip"),
          m: "opacity",
          start: 0,
          k: 1
        }, {
          s: b.i("video-noflip"),
          m: "top",
          start: 2 * -b.X,
          k: 0
        }];

        if (b.v) {
          var e = b.i("bg"),
              g = b.i("overlay");
          e.style.width = "100%";
          e.style.height = "100%";
          g.style.width = "100%";
          b.N(b.Q(), "exiting");
          b.N(e, "visible");
          c.push({
            s: b.i("bg"),
            m: "opacity",
            start: 0,
            k: f.la
          });
        }

        b.i("video-holder").innerHTML = b.Id;
        b.Xa ? (b.N("flipper", "flipped"), setTimeout(a, f.M)) : b.pa(c, f.M, a);
      });

      f.prototype.Qa = function (a, b, d) {
        this.D ? (b = b || {}, b = c.extend(b, {
          campaign_id: this.D,
          message_id: this.Qb,
          message_type: "web_inapp",
          message_subtype: this.fa
        }), this.eb.track(a, b, d)) : d && d.call();
      };

      f.prototype.zb = c.l(function () {
        var a = this;

        if (!a.Jd) {
          a.Jd = m;
          var b = a.i("video-elapsed"),
              d = a.i("video-time"),
              e = a.i("video-progress");
          new window.YT.Player(f.z + "-video-frame", {
            events: {
              onReady: function onReady(g) {
                function f(a) {
                  var a = Math.round(i - a),
                      b = Math.floor(a / 60),
                      c = Math.floor(b / 60),
                      a = a - 60 * b;
                  d.innerHTML = "-" + (c ? c + ":" : "") + ("00" + (b - 60 * c)).slice(-2) + ":" + ("00" + a).slice(-2);
                }

                var h = g.target,
                    i = h.getDuration();
                f(0);
                a.Mc = window.setInterval(function () {
                  var a = h.getCurrentTime();
                  b.style.width = 100 * (a / i) + "%";
                  f(a);
                }, 250);
                c.o(e, "click", function (a) {
                  a = Math.max(0, a.pageX - e.getBoundingClientRect().left);
                  h.seekTo(i * a / e.clientWidth, m);
                });
              }
            }
          });
        }
      });
      h.prototype.init = h.prototype.U;
      h.prototype.reset = h.prototype.reset;
      h.prototype.disable = h.prototype.disable;
      h.prototype.time_event = h.prototype.Ad;
      h.prototype.track = h.prototype.J;
      h.prototype.track_links = h.prototype.Dd;
      h.prototype.track_forms = h.prototype.Cd;
      h.prototype.track_pageview = h.prototype.ac;
      h.prototype.register = h.prototype.ia;
      h.prototype.register_once = h.prototype.G;
      h.prototype.unregister = h.prototype.Ca;
      h.prototype.identify = h.prototype.Ya;
      h.prototype.alias = h.prototype.Nc;
      h.prototype.name_tag = h.prototype.jd;
      h.prototype.set_config = h.prototype.Wb;
      h.prototype.get_config = h.prototype.c;
      h.prototype.get_property = h.prototype.xa;
      h.prototype.get_distinct_id = h.prototype.T;
      h.prototype.toString = h.prototype.toString;
      h.prototype._check_and_handle_notifications = h.prototype.kb;
      h.prototype._show_notification = h.prototype.yb;
      o.prototype.properties = o.prototype.ha;
      o.prototype.update_search_keyword = o.prototype.dc;
      o.prototype.update_referrer_info = o.prototype.ib;
      o.prototype.get_cross_subdomain = o.prototype.bd;
      o.prototype.clear = o.prototype.clear;
      p.prototype.set = p.prototype.set;
      p.prototype.set_once = p.prototype.Xb;
      p.prototype.increment = p.prototype.Mb;
      p.prototype.append = p.prototype.append;
      p.prototype.union = p.prototype.bc;
      p.prototype.track_charge = p.prototype.Bd;
      p.prototype.clear_charges = p.prototype.Sc;
      p.prototype.delete_user = p.prototype.Uc;
      p.prototype.toString = p.prototype.toString;
      c.od(h);
      var y = {};

      (function () {
        L = 1;
        s = window.mixpanel;
        c.d(s) ? k.ca('"mixpanel" object not initialized. Ensure you are using the latest version of the Mixpanel JS Library along with the snippet we provide.') : s.__loaded || s.config && s.persistence ? k.error("Mixpanel library has already been downloaded at least once.") : 1.1 > (s.__SV || 0) ? k.ca("Version mismatch; please ensure you're using the latest version of the Mixpanel code snippet.") : (c.a(s._i, function (a) {
          a && c.isArray(a) && (y[a[a.length - 1]] = H.apply(this, a));
        }), X(), s.init(), c.a(y, function (a) {
          a.sa();
        }), W());
      })();
    })();
  })(); // end http://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js

}
/* eslint-enable */

/* jshint ignore:end */

/**
 * @param {string} mixpanelToken
 * @returns {object} mixpanel
 */


module.exports.init = function () {
  window.mixpanel.init.apply(window, arguments);
  return window.mixpanel;
};
}, {}];
