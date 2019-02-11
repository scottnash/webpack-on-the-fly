window.modules["186"] = [function(require,module,exports){'use strict';

var moment = require(190);
/**
 * Check to see if we are currently experiencing in a
 * Time-Space that *~exists~* between the date strings
 * specified in the component's data.
 *
 * @param  {Object} componentData  The component's saved data
 * @return {Object}
 */


function isBetween(componentData) {
  if (!moment().isBetween(componentData.startDate, componentData.endDate)) {
    throw new Error('Not within start and end times');
  }

  componentData.displaySelf = true;
  return componentData;
}

;
/**
 * Perform some time checks when saving the logic to component
 * or startDates that occur after endDates
 *
 * @param  {Object} data The component's data on save
 * @return {Object}
 */

function onUpdate(data) {
  if (!moment(data.startDate).isBefore(moment(data.endDate))) {
    data.startDay = '';
    data.endDay = '';
    data.startTime = '';
    data.endTime = '';
    data.startDate = '';
    data.endDate = '';
  }

  return data;
}

module.exports = isBetween;
module.exports.onUpdate = onUpdate;
}, {"190":190}];
