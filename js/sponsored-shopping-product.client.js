window.modules["sponsored-shopping-product.client"] = [function(require,module,exports){'use strict';

var _isString = require(164),
    _includes = require(33);

DS.controller('sponsored-shopping-product', ['$document', function ($document) {
  var Constructor = function Constructor(el) {
    this.el = el;
    this.bamxString = 'shop-links.co/';
    this.bamxId = 'bamxProduct';
    this.checkProductLink();
  };

  Constructor.prototype = {
    checkProductLink: function checkProductLink() {
      var buyLink = this.el.querySelector('a.product-buy'),
          productUrl,
          scriptEl; // If the product link contains the BAM-X string, insert the BAM-X script
      // (we only want one of these per page)

      if (buyLink) {
        productUrl = buyLink.getAttribute('href');

        if (_isString(productUrl) && _includes(productUrl, this.bamxString)) {
          scriptEl = $document.querySelector('#' + this.bamxId);

          if (!scriptEl) {
            this.insertBamxScript();
          } // indicate that affiliate id's should not be added by `components/affiliate-links/client.js`


          buyLink.setAttribute('data-affiliate-links-ignore', 'true');
        }
      }
    },
    insertBamxScript: function insertBamxScript() {
      var scriptEl, firstScriptEl;
      scriptEl = $document.createElement('script');
      scriptEl.id = this.bamxId;
      scriptEl.type = 'text/javascript';
      scriptEl.src = '//static.bam-x.com/tags/nymag.js';
      scriptEl.async = true;
      firstScriptEl = $document.getElementsByTagName('script')[0];
      firstScriptEl.parentNode.insertBefore(scriptEl, firstScriptEl);
    }
  };
  return Constructor;
}]);
}, {"33":33,"164":164}];
