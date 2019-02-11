window.modules["image-grid-image.model"] = [function(require,module,exports){'use strict';

var isEmpty = require(75),
    maxImgWidth = 1180;
/**
 * update image-grid and allow users to edit the width and the height from kiln
 * @param {object} data
 */

/**
* Images are the given the width and height from input from user on desktop, but are shown at 100% width on mobile/tablet.
* So we're pulling in the largest image that will be needed based on the aspect ratio from the user input.
* This component should be refactored to accommodate 2x images and more appropriate
* image sizes depending on viewport.
*/


function editWidthAndHeight(data) {
  var imageAspectRatio, imageWidth, imageHeight;

  if (data.width && data.height && !isEmpty(data.url)) {
    // Calculate image ratio based on user input
    imageAspectRatio = data.width / data.height;
    imageWidth = maxImgWidth;
    imageHeight = Math.round(maxImgWidth / imageAspectRatio); // Set the image url

    if (data.url.match(/\.w\d+/i)) {
      data.url = data.url.replace(/\.w\d+/i, '.w' + imageWidth);
      data.url = data.url.replace(/\.h\d+/i, '.h' + imageHeight);
    } else {
      var urlParts = data.url.split('.'),
          extension = '.' + urlParts.pop();
      data.url = urlParts.join('.');
      data.url = data.url + '.w' + imageWidth;
      data.url = data.url + '.h' + imageHeight;
      data.url = data.url + extension;
    }
  }
}
/**
 * update image-grid and allow users to edit the width and the height from kiln
 * @param {string} ref
 * @param {object} data
 * @returns {object}
 */


module.exports.save = function (ref, data) {
  editWidthAndHeight(data);
  return data;
};
}, {"75":75}];
