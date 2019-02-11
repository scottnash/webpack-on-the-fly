window.modules["contact-form.client"] = [function(require,module,exports){'use strict';

var _every = require(93),
    ajax = require(88),
    _require = require(92),
    isValidCompanyName = _require.isValidCompanyName,
    isValidEmail = _require.isValidEmail,
    isValidName = _require.isValidName,
    isValidPhoneNumber = _require.isValidPhoneNumber,
    FIELD_LIST = ['firstName', 'lastName', 'companyName', 'email', 'phone'];

module.exports = function (el) {
  var contactForm = el,
      endpoint = el.dataset.formEndpoint,
      inputFields = contactForm.querySelectorAll('input:not([type="submit"])'),
      inputValidationMapping = {
    firstName: isValidName,
    lastName: isValidName,
    companyName: isValidCompanyName,
    email: isValidEmail,
    phone: isValidPhoneNumber
  },
      inputValidationState = {
    firstName: false,
    lastName: false,
    companyName: false,
    email: false,
    phone: false
  };
  contactForm.addEventListener('submit', handleFormSubmit);
  inputFields.forEach(function (input) {
    return input.addEventListener('blur', validateInputField);
  });
  /**
   * Validates the input field based on its constraints
   *
   * @param {Object} event The event containing the element's data
   */

  function validateInputField(event) {
    event.preventDefault();
    var _event$target = event.target,
        name = _event$target.name,
        parentNode = _event$target.parentNode,
        value = _event$target.value,
        validationFn = inputValidationMapping[name],
        isValid = validationFn(value);
    inputValidationState[name] = isValid;
    toggleError(isValid, parentNode);
  }
  /**
   * Submits the form data through a request
   *
   * @param {Object} event The event containing the element's data
   */


  function handleFormSubmit(event) {
    event.preventDefault();

    var isFormValid = _every(inputValidationState);

    if (isFormValid) {
      ajax.sendReceiveJson({
        method: 'POST',
        url: endpoint,
        dataType: 'json',
        data: getFormValues()
      }, function (err) {
        if (err) {
          contactForm.classList.add('error');
        } else {
          contactForm.classList.remove('error');
          contactForm.classList.add('submitted');
        }
      });
    }
  }
  /**
   * Gets the information submitted by the user
   *
   * @returns {Object} The information submitted by the user
   */


  function getFormValues() {
    return FIELD_LIST.reduce(function (result, item) {
      result[item] = contactForm[item].value || '';
      return result;
    }, {});
  }
  /**
   * Toggles error class on element
   *
   * @param {boolean} isValid
   * @param {Node} parentNode
   * @param {string} styleClass
   */


  function toggleError(isValid, parentNode) {
    var styleClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'error';
    var addOrRemove = isValid ? 'remove' : 'add';
    parentNode.classList[addOrRemove](styleClass);
  }
};
}, {"88":88,"92":92,"93":93}];
