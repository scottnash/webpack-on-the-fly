window.modules["92"] = [function(require,module,exports){'use strict';
/*
 * @Note (c.g. 2018-02-06) email regex adapted from: http://emailregex.com/
 */

var MAX_LENGTH_COMPANY_NAME = 50,
    MAX_LENGTH_EMAIL = 50,
    MAX_LENGTH_NAME = 27,
    MAX_LENGTH_PHONE = 20,
    REGEX_EMAIL = /^(?:(?:[^<>()\[\]\\.,;:\s@"]+(?:\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(?:(?:\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(?:(?:[a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    REGEX_NAME = /^[-'a-zA-Z ]+$/,
    REGEX_PHONE = /^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/;
/**
 * Validates name field value
 *
 * @param {string} str - input string
 * @return {boolean} true if input is not empty and passes regex
 */

function isValidName(str) {
  return str.length && str.length <= MAX_LENGTH_NAME && REGEX_NAME.test(str);
}
/**
 * Validates company name field value
 *
 * @param {string} str - input string
 * @return {boolean} true if input is not empty and matches constraints
 */


function isValidCompanyName(str) {
  return str.length && str.length <= MAX_LENGTH_COMPANY_NAME;
}
/**
 * Validates email field value
 *
 * @param {string} str - email input value
 * @return {boolean} true if email has value and
 * it's shorter or equal than 50 characters and
 * matches the regex above
 */


function isValidEmail(str) {
  return str.length && str.length <= MAX_LENGTH_EMAIL && REGEX_EMAIL.test(str);
}
/**
 * Validates phone number field value
 *
 * @param {string} str - phone number input value
 * @return {boolean} true if phone number has value and
 * it's shorter or equal than 50 characters and
 * matches the regex above
 */


function isValidPhoneNumber(str) {
  return str.length && str.length <= MAX_LENGTH_PHONE && REGEX_PHONE.test(str);
}

module.exports = {
  isValidCompanyName: isValidCompanyName,
  isValidEmail: isValidEmail,
  isValidName: isValidName,
  isValidPhoneNumber: isValidPhoneNumber
};
}, {}];
