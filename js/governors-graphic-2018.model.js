window.modules["governors-graphic-2018.model"] = [function(require,module,exports){'use strict';

var states = require(91);

module.exports.save = function (ref, data) {
  var stateList = states.statesToArray(),
      i,
      stateName,
      stateNameLower;
  data.repStates = [];
  data.demStates = [];
  data.indStates = [];

  for (i = 0; i < stateList.length; i++) {
    stateName = stateList[i];
    stateNameLower = stateList[i].toLowerCase().split(' ').join('');

    if (data[stateNameLower]) {
      // Only 36 states have a field in the schema (those with elections in 2018).
      switch (data[stateNameLower]) {
        case 'republican':
          data.repStates.push(stateName);
          break;

        case 'democrat':
          data.demStates.push(stateName);
          break;

        case 'independent':
          data.indStates.push(stateName);
          break;

        default:
          break;
      }
    }
  }

  return data;
};
}, {"91":91}];
