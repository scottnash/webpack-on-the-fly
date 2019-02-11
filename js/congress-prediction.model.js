window.modules["congress-prediction.model"] = [function(require,module,exports){'use strict';

var states = require(91),
    utils = require(43),
    styles = require(44);
/* eslint complexity: ["error", 9] */


module.exports.save = function (ref, data) {
  var stateList, i, stateName, stateNameLower;
  data.demStates = [];
  data.gopStates = [];
  data.tossupStates = [];
  data.indStates = [];

  if (data.predictionType === 'states') {
    stateList = states.statesToArray();

    for (i = 0; i < stateList.length; i++) {
      stateName = stateList[i];
      stateNameLower = stateList[i].toLowerCase().split(' ').join('');

      if (data[stateNameLower]) {
        switch (data[stateNameLower]) {
          case 'democrat':
            data.demStates.push(stateName);
            break;

          case 'republican':
            data.gopStates.push(stateName);
            break;

          case 'independent':
            data.indStates.push(stateName);
            break;

          case 'tossup':
            data.tossupStates.push(stateName);
            break;

          default:
            break;
        }
      }
    }
  }

  if (!utils.isFieldEmpty(data.sass)) {
    return styles.render(ref, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = '';
    return Promise.resolve(data);
  }
};
}, {"43":43,"44":44,"91":91}];
