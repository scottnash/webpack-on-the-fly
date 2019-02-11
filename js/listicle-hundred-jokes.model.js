window.modules["listicle-hundred-jokes.model"] = [function(require,module,exports){'use strict';

var isEmpty = require(75); // autopopulates the byline field in the settings based on the inline input


function updateNavBylineSettings(data) {
  if (data.bylines.length > 0 && isEmpty(data.navByline)) {
    data.navByline = data.bylines.map(function (person) {
      return person.text;
    }).join(', ');
  }

  return data;
}

function generateAnchorLink(data) {
  var slug = ''; // an anchor link slug has the format of 'label-headline' or just 'headline' when there's no label

  if (data.headline) {
    data.headline = data.headline.toString();

    if (data.label) {
      data.label = data.label.toString();
      slug = data.label.replace(/[^A-Za-z0-9]+/g, '') + '-' + data.headline.replace(/[^A-Za-z0-9]+/g, '');
      data.anchorLinkSlug = slug;
    } else {
      data.anchorLinkSlug = data.headline.replace(/[^A-Za-z0-9]+/g, '');
    }
  }
}
/**
 * update listicle-item
 * @param {string} ref
 * @param {object} data
 * @returns {object}
 */


module.exports.save = function (ref, data) {
  updateNavBylineSettings(data);
  generateAnchorLink(data);
  return data;
};
}, {"75":75}];
