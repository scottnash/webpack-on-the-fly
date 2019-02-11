window.modules["1276"] = [function(require,module,exports){'use strict';

var names = {
  betamale: 'Beta Male',
  developing: 'Developing',
  grubstreet: 'Grub Street',
  intelligencer: 'Intelligencer',
  nymag: 'New York Magazine',
  nyxny: 'New York by New York',
  vulture: 'Vulture',
  scienceofus: 'Science of Us',
  selectall: 'Select All',
  strategist: 'The Strategist',
  travel: 'Travel',
  vindicated: 'The Vindicated',
  wwwthecut: 'The Cut'
};
/**
 * Returns the site name titlecased based on the slug
 * @param {string} slug The site slug
 * @returns {string}
 */

function getSiteName(slug) {
  return names[slug];
}
/**
 * Returns comma-separated site names from comma-separated slugs
 * @param {string} slugs comma-separated string of slugs
 * @returns {string}
 */


module.exports = function (slugs) {
  return slugs.split(', ').map(getSiteName).join(', ');
};
}, {}];
