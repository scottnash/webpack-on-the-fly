window.modules["lede-full-bleed.model"] = [function(require,module,exports){'use strict';

var _isEmpty = require(75),
    sanitize = require(39),
    striptags = require(42),
    styles = require(44),
    brandingRubricHandlers = require(144);
/**
 * Only allow emphasis, italic, and strikethroughs in headlines.
 * @param  {string} oldHeadline
 * @returns {string}
 */


function stripHeadTags(oldHeadline) {
  return striptags(oldHeadline, ['em', 'i', 's', 'strike', 'span']);
}
/**
 * See if a field exists and is not empty.
 * @param {string} field
 * @returns {boolean}
 */


function has(field) {
  return field && field.length > 0;
}
/**
 * Update and sanitize headline.
 * @param {object} data
 * @returns {object}
 */


function updateHeadline(data) {
  // Add smart quotes, etc to wysiwyg headlines
  // Also strip out unwanted html tags
  if (has(data.displayHeadline)) {
    data.displayHeadline = sanitize.toSmartHeadline(stripHeadTags(data.displayHeadline));
  }

  return data;
}
/**
 * Update and sanitize teaser.
 * @param {object} data
 * @returns {object}
 */


function updateTeaser(data) {
  // Add smart quotes, etc to teaser
  // Also strip out unwanted html tags
  if (has(data.displayTeaser)) {
    data.displayTeaser = sanitize.toSmartText(stripHeadTags(data.displayTeaser));
  }

  return data;
}
/**
 * Translates the selected position to the appropiate flex-box property
 * @param {object} data
 * @param {string} orientation
 * @returns {object}
 */


function parseTextPosition(data) {
  var mapping = {
    top: 'flex-start',
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
    bottom: 'flex-end'
  }; // account for undefined properties and set to 'center'

  if (!data.textVerticalPosition) {
    data.textVerticalPosition = 'center';
  }

  if (!data.textHorizontalPosition) {
    data.textHorizontalPosition = 'center';
  }

  data.alignItemsProp = mapping[data.textVerticalPosition];
  data.justifyContentProp = mapping[data.textHorizontalPosition];
  return data;
}
/**
 * Calls a rubric handler for a page when certain conditions are met
 * Conditions are contained in an array iterated over in order
 * When the first condition is met, it will use that rubric and stop
 * @param {object} handlers
 * @param {object} data make sure to set a default, so handlers can assume it exists
 * @param {object} locals make sure to set a default, so handlers can assume it exists
 */


function callRubricHandlers() {
  var handlers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var locals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var handlerIndex;

  for (handlerIndex = 0; handlerIndex < handlers.length; handlerIndex++) {
    if (handlers[handlerIndex].when(data, locals)) {
      handlers[handlerIndex].handler(data);
      break;
    }
  }
}
/**
 * set tag rubric
 * @param {object} data
 * @param {object} locals
 */


function setRubrics(data, locals) {
  // always check for the graphical branding rubric
  callRubricHandlers(brandingRubricHandlers, data, locals);
}

module.exports.save = function (uri, data, locals) {
  // Do these in order
  updateHeadline(data);
  updateTeaser(data);
  parseTextPosition(data);
  setRubrics(data, locals);

  if (!_isEmpty(data.sass)) {
    return styles.render(uri, data.sass).then(function (css) {
      data.css = css;
      return data;
    });
  } else {
    data.css = '';
    return Promise.resolve(data);
  }
};
}, {"39":39,"42":42,"44":44,"75":75,"144":144}];
