window.modules["1266"] = [function(require,module,exports){'use strict';

var dateFormat = require(52),
    sitePaths = {
  // if a site uses folders for each day (YYYY/MM/DD/) we'll open the current day
  // if a site has a custom prefix, we'll use that
  // otherwise, if a site is on this list, we'll use 'daily/<slug>' as the folder prefix
  // for sites not on this list, we'll just open the daily/ folder
  strategist: {
    date: true // true if it uses the /YYYY/MM/DD/ folder structure
    // note: no prefix means this'll use 'daily/<slug>/YYYY/MM/DD/'

  },
  vindicated: {
    date: true,
    prefix: 'daily/strategist' // custom (not daily/<slug>/) folder
    // note: will prefix and date, this'll use 'daily/strategist/YYYY/MM/DD/'

  },
  vulture: {
    date: true
  },
  selectall: {
    date: true
  },
  scienceofus: {
    date: true,
    prefix: 'daily/science'
  },
  di: {
    date: true,
    prefix: 'daily/intelligencer'
  },
  intelligencer: {
    date: true,
    prefix: 'daily/intelligencer'
  },
  thecut: {
    date: true,
    prefix: 'fashion/daily'
  },
  wwwthecut: {
    date: true,
    prefix: 'fashion/daily'
  },
  grubstreet: {
    date: true,
    prefix: 'daily/grub'
  },
  nyxny: true,
  // no daily folders, just use 'daily/<slug>/'
  betamale: {
    date: true
  },
  press: {
    date: true
  },
  speed: {
    date: true
  },
  thejob: {
    date: true,
    prefix: 'daily/the-job'
  }
};
/**
 * get site path
 * @param  {string} slug
 * @return {string}
 */


function getSitePath(slug) {
  var sitePath = sitePaths[slug];

  if (sitePath && sitePath.date) {
    var now = dateFormat(new Date(), 'YYYY/MM/DD');
    return "".concat(getSitePrefix(sitePath, slug), "/").concat(now);
  } else if (sitePath) {
    // go to prefix or slug folder
    return getSitePrefix(sitePath, slug);
  } else {
    return 'daily';
  }
}
/**
 * get site prefix / slug folder
 * @param  {object|boolean} sitePath
 * @param  {string} slug
 * @return {string}
 */


function getSitePrefix(sitePath, slug) {
  if (sitePath.prefix) {
    return sitePath.prefix;
  } else {
    return "daily/".concat(slug);
  }
}

module.exports.getSitePath = getSitePath;
}, {"52":52}];
