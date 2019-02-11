window.modules["91"] = [function(require,module,exports){'use strict';
/**
 * This service contains a list of the 50 US states.
 * Contains helper functions like getting a state's name from the abbreviation
 */

var _values = require(60),
    _require = require(43),
    valuesToOptions = _require.valuesToOptions,
    stateList = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  DC: 'District Of Columbia',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming'
};
/**
 * Gets state name from abbreviation.
 * @param {string} stateAbbr - The state abbreviation.
 * @returns {string} The full state name.
 * (e.g. 'AZ' -> 'Arizona')
 */


function abbreviationToFull(stateAbbr) {
  var uppercaseStateAbbr = stateAbbr && typeof stateAbbr === 'string' ? stateAbbr.toUpperCase() : '';
  return stateList[uppercaseStateAbbr] || '';
}
/**
 * Turns list into state names to an array.
 * @returns {string[]} alphabetical list of all states
 * (e.g. ['Alabama', 'Alaska', 'Arizona' ...])
 */


function statesToArray() {
  return _values(stateList).sort();
}
/**
 * Turns states into `select` `options`, using the short name as value and the name as the label.
 * @returns {string} Option elements
 * (e.g. <option value="AL">Alabama</option><option...)
 */


function statesToOptions() {
  return valuesToOptions(stateList);
}
/*
 * Gets state abbreviation from name.
 * @param {string} name
 * @returns {string}
 */


function fullToAbbreviation(name) {
  return Object.keys(stateList).find(function (key) {
    return stateList[key] === name;
  }) || '';
}

module.exports = {
  abbreviationToFull: abbreviationToFull,
  statesToArray: statesToArray,
  statesToOptions: statesToOptions,
  fullToAbbreviation: fullToAbbreviation
};
}, {"43":43,"60":60}];
