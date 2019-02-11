window.modules["follow.client"] = [function(require,module,exports){/* jshint strict: true, browser: true */

/* global DS */
'use strict';

var _find = require(71),
    $popup = require(40);

DS.controller('follow', [function () {
  function Constructor(el) {
    this.el = el;
    this.handle = el.getAttribute('data-handle');
  }

  Constructor.prototype = {
    events: {
      click: 'openFollow'
    },

    /**
     * opens new browser window to corresponding
     * social network follow page
     * @param {Event} e
     */
    openFollow: function openFollow(e) {
      var Position = $popup.position,
          Params = $popup.params,
          opts = {},
          dims = {
        w: 780,
        h: 500
      },
          features = new Position(dims.w, dims.h),
          classList = this.el.classList,
          args,
          socialHandler,
          socialNetworks = [{
        className: 'facebook',
        url: 'https://facebook.com/{handle}',
        network: 'Facebook'
      }, {
        className: 'pinterest',
        url: 'http://www.pinterest.com/{handle}',
        network: 'Pinterest'
      }, {
        className: 'instagram',
        url: 'https://www.instagram.com/{handle}',
        network: 'Instagram'
      }, {
        className: 'rss',
        url: 'http://feeds.feedburner.com/{handle}',
        network: 'RSS'
      }, {
        className: 'twitter',
        url: 'https://twitter.com/intent/follow?screen_name={handle}&tw_p=followbutton&variant=2.0',
        network: 'Twitter'
      }, {
        className: 'snapchat',
        url: 'https://www.snapchat.com/discover/{handle}',
        network: 'Snapchat'
      }];
      opts.handle = this.handle;
      dims.left = features.left;
      dims.top = features.top;
      socialHandler = _find(socialNetworks, function (socialNetwork) {
        return classList.contains(socialNetwork.className);
      });
      opts.url = socialHandler.url.replace('{handle}', opts.handle);
      opts.network = socialHandler.network;
      opts.name = 'Follow ' + opts.handle + ' on ' + opts.network;
      args = new Params(opts, dims);
      window.open(args.address, args.name, args.features);
      e.preventDefault();
    }
  };
  return Constructor;
}]);
}, {"40":40,"71":71}];
