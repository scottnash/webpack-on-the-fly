window.modules["subscription-plan.model"] = [function(require,module,exports){'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var planCodes = {
  Digital: 'D',
  'Digital and Print': 'B'
},
    _require = require(43),
    has = _require.has,
    sanitize = require(39),
    planOptions = {
  Digital: {
    planName: 'Digital',
    planHeadline: 'Try free for a month',
    unselectedButtonText: 'Start your free trial now!'
  },
  'Digital and Print': {
    planName: 'Digital and Print',
    planHeadline: 'Enjoy 12 issues for $12',
    unselectedButtonText: 'Subscribe to Print & Digital'
  },
  'NY x NY Membership': {
    planName: 'NY x NY Membership',
    planHeadline: 'Try free for a month',
    unselectedButtonText: 'Start your free trial now!'
  }
};
/**
 * sanitize headlines and teasers
 * @param  {object} data
 */


function sanitizeInputs(data) {
  if (has(data.planHeadline)) {
    data.planHeadline = sanitize.toSmartHeadline(data.planHeadline);
  }

  if (has(data.planSubHeadline)) {
    data.planSubHeadline = sanitize.toSmartHeadline(data.planSubHeadline);
  }
}

function prefillPlanDetails(data) {
  var planType = data.planType,
      planData = planOptions[planType],
      keys = _typeof(planData) === 'object' ? Object.keys(planData) : [];
  keys.forEach(function (key) {
    if (!data[key]) {
      data[key] = planData[key];
    }
  });
}

module.exports.save = function (ref, data) {
  prefillPlanDetails(data);
  sanitizeInputs(data);
  data.planCode = planCodes[data.planType];
  ['planSourceKey', 'planTerms'].forEach(function (property) {
    if (data[property]) {
      data[property] = data[property].trim();
    }
  });
  return data;
};
}, {"39":39,"43":43}];
