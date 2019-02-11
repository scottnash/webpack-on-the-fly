window.modules["item-dropdown.client"] = [function(require,module,exports){'use strict';

module.exports = function (el) {
  var revealItems = el.querySelector('.reveal-items'),
      searchField = el.querySelector('.search'),
      dropdownButton = el.querySelector('.item-dropdown-button'),
      noResultsItem = el.querySelector('.no-results'),
      allResults = Array.from(el.querySelectorAll('.item-list-item'));
  dropdownButton.addEventListener('click', toggleList);
  searchField.addEventListener('keyup', handleSearch);

  function toggleList() {
    revealItems.classList.toggle('hide-item');
    dropdownButton.classList.toggle('expanded');

    if (dropdownButton.getAttribute('aria-expanded') === 'false') {
      dropdownButton.setAttribute('aria-expanded', 'true');
    } else {
      dropdownButton.setAttribute('aria-expanded', 'false');
    }
  }

  function handleSearch() {
    var searchQuery = searchField.value.toLowerCase(),
        resultsToDisplay,
        i;
    resultsToDisplay = allResults.filter(function (result) {
      var itemText = result.querySelector('.item-list-item-link-text').textContent.toLowerCase();

      if (!itemText.includes(searchQuery)) {
        result.classList.add('hide-item');
      } else {
        result.classList.remove('hide-item');
      }

      return itemText.includes(searchQuery);
    }); // reset borders and remove border from last displayed result

    if (resultsToDisplay.length) {
      for (i = 0; i < resultsToDisplay.length - 1; i++) {
        resultsToDisplay[i].classList.remove('unbordered');
      }

      resultsToDisplay[resultsToDisplay.length - 1].classList.add('unbordered');
    } // toggle `no results` message


    if (!resultsToDisplay.length) {
      noResultsItem.classList.remove('hide-item');
    } else {
      noResultsItem.classList.add('hide-item');
    }
  }
};
}, {}];
