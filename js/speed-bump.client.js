window.modules["speed-bump.client"] = [function(require,module,exports){'use strict';

var gtm = require(41),
    visibility = require(26);

module.exports = function (el, opts) {
  if (!opts || !el) {
    return;
  }

  var name = opts.name,
      speedbumpDescription = opts.speedbumpDescription,
      speedbumpMessage = opts.speedbumpMessage,
      speedbumpLink = opts.speedbumpLink,
      baseTrackingData = opts.baseTrackingData,
      visible = new visibility.Visible(el, {
    shownThreshold: 0.5
  });
  el.querySelector('.description').innerHTML = speedbumpDescription;
  el.querySelector('.promo-link').innerHTML = speedbumpMessage;
  el.querySelector('.promo-link').href = speedbumpLink;
  el.classList.remove('collapsed');
  /**
   * GA Tracking Zone
   */

  visible.on('shown', function () {
    if (visibility.isElementNotHidden(el)) {
      var data = baseTrackingData;
      data.event = 'eec.promotionView';
      data.ecommerce = {
        promoView: {
          promotions: [{
            name: name,
            creative: speedbumpDescription,
            id: 'speed bump',
            position: 'in-article'
          }]
        }
      };
      gtm.reportNow(data);
      visible.destroy();
    }
  });
  el.querySelector('.promo-link').addEventListener('click', function () {
    var data = baseTrackingData;
    data.event = 'eec.promotionClick';
    data.ecommerce = {
      promoClick: {
        promotions: [{
          name: name,
          creative: speedbumpDescription,
          id: 'speed bump',
          position: 'in-article'
        }]
      }
    };
    gtm.reportNow(data);
  });
};
}, {"26":26,"41":41}];
