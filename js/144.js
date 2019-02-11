window.modules["144"] = [function(require,module,exports){'use strict';

var brandingRubricHandlers = [{
  when: isSponsored,
  handler: sponsoredRubric
}];

function isSponsored(data) {
  return data.featureTypes && data.featureTypes['Sponsor Story'];
}
/**
 * Sets the graphical rubric for the sponsored pop-up.
 * We also want to hide the tag rubric for sponsored
 * @param {object} data
 */


function sponsoredRubric(data) {
  data.sponsoredRubric = true;
  data.rubric = undefined; // hide the tag rubric when sponsored
}

module.exports = brandingRubricHandlers;
}, {}];
