window.modules["sticky-list.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    $gtm = require(41),
    stickyContainer = require("sticky-container.client");

DS.controller('sticky-list', ['$window', function ($window) {
  var mezr = require(194),
      bottomMargin = 40;

  function Constructor(el) {
    var breakoutSelectors = ['.full-bleed', '.image-layout', '.nym-image.break-out', '.youtube.editorial.break-out', '.youtube.sponsored.break-out'];
    var outstream,
        observer,
        mutationObserverCallback = adjustContainerHeight.bind(this);

    if ($window.innerWidth < 1180) {
      return;
    }

    this.rightRail = el;
    this.contentArea = dom.find(this.rightRail.getAttribute('data-content-area-selector'));
    this.breakouts = Array.from(dom.findAll(this.contentArea, breakoutSelectors.join(',')));
    this.firstPinHeight = parseInt(this.rightRail.getAttribute('data-first-pin-height'));
    this.nextPinHeight = parseInt(this.rightRail.getAttribute('data-next-pin-height'));
    this.smallMax = parseInt(this.rightRail.getAttribute('data-small-max'));
    this.pins = [];
    this.pinboards = [];
    outstream = dom.find('[data-label="outStreamDesktop"]'); // look for an outstream ad and watch it for changes
    // we need to do this because opening and closing it
    // changes the height of the article and the containers
    // need to react to this change in order to allow full
    // bleed components to break into it

    if (outstream) {
      observer = new MutationObserver(mutationObserverCallback);
      observer.observe(outstream, {
        attributes: true,
        childList: true,
        attributeFilter: ['class'],
        subtree: true
      });
    }

    document.addEventListener('readystatechange', function () {
      // wait for all of the page content (embeds, etc.) to load so we have a better idea of the wrapper height
      if (document.readyState === 'complete') {
        this.setPins();
        Array.from(dom.findAll(this.rightRail, '.ad')).forEach(function (ad) {
          DS.get('ad', ad);
        }); // init tracking for everything we just added

        $gtm.initializeElement(this.rightRail);
      }
    }.bind(this));
  }
  /**
   * getItemFromSpace
   *
   * @param {Element} space a clay-space component
   * @returns {Element} the visible component in the space
   */


  function getItemFromSpace(space) {
    var logic = dom.find(space, '.space-logic');

    if (!logic || !logic.children) {
      return;
    }

    return logic.children[0];
  }
  /**
   * duplicateItem
   *
   * clones components so they can be repeated in the list
   * handles reinitializing ads and other components that have DS controllers
   *
   * @param {Element} item an element to be duplicated
   * @returns {Element} duplicated element
   */


  function duplicateItem(item) {
    var duplicate, input, label, newId; // if the item is an ad, we need to duplicate its attributes and call the DS handler on the new element to get it populated by DFP
    // otherwise just clone the item and all its children

    if (item.classList.contains('ad')) {
      duplicate = item.cloneNode();
      duplicate.id = 'ad-cid-' + Math.round(Math.random() * 10000000);
      duplicate.removeAttribute('data-google-query-id');
    } else {
      duplicate = item.cloneNode(true);

      if (duplicate.classList.contains('newsletter-flex-text')) {
        input = dom.find(duplicate, '.email');
        label = dom.find(duplicate, '.email-label'); // set a new id so the browser doesn't complain

        newId = 'columnSubscribeEmail-' + Math.round(Math.random() * 100000);
        input.id = newId;
        label.setAttribute('for', newId);
        DS.get('newsletter-flex-text', duplicate);
      }

      if (duplicate.classList.contains('sticky-container')) {
        stickyContainer(duplicate);
      }
    }

    return duplicate;
  }
  /**
   * adjustContainerHeight
   *
   * adjusts the height of the top most container based on changes to the outstream ad's height
   *
   * @param {MutationRecord} mutationRecord Object representing a change in the watched element (https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord)
   */


  function adjustContainerHeight(mutationRecord) {
    var outstreamHeight = 379,
        mutation,
        iframe;

    if (!mutationRecord || !this.containers) {
      return;
    }

    mutation = mutationRecord[0]; // we're looking for changes on the iframe inside the ad
    // if its opened, we want to add its height to the topmost container
    // when it is closed by a user, subtract its height from the topmost container

    if (mutation.target.tagName === 'IFRAME') {
      iframe = mutation.target;

      if (iframe.classList.contains('is-closed')) {
        this.containers[0].style.height = mezr.height(this.containers[0]) - outstreamHeight + 'px';
      } else {
        this.containers[0].style.height = mezr.height(this.containers[0]) + outstreamHeight + 'px';
      }
    }
  }

  Constructor.prototype = {
    setPins: function setPins() {
      var contentAreaHeight = mezr.height(this.contentArea),
          containerHeight,
          numPinboards,
          pinboard,
          i; // filter the content for spaces and hidden components

      this.populatePinsList(); // re-initialize the contents of the list and add it all back in if the article is too short for sticky behavior

      if (contentAreaHeight < this.smallMax) {
        this.pins.forEach(function (item) {
          this.rightRail.appendChild(duplicateItem(item));
        }.bind(this));
        this.rightRail.classList.add('short-article');
        return;
      }

      this.rightRail.style.height = contentAreaHeight + 'px'; // set the containers that will block out areas for full-bleed components to overflow the right rail

      this.containers = this.setContainers(); // populate each container with as many sticky areas as possible

      this.containers.forEach(function (container) {
        containerHeight = parseInt(window.getComputedStyle(container).getPropertyValue('height')); // could be either an absolute height or a flex height

        numPinboards = this.setNumPinboards(containerHeight);

        if (numPinboards > 1) {
          container.classList.add('multi-children');
        } // add sticky areas to container


        for (i = 0; i < numPinboards; i++) {
          pinboard = document.createElement('div');
          pinboard.classList.add('pinboard');
          container.appendChild(pinboard);
          this.pinboards.push(pinboard);
        }
      }.bind(this)); // once all the sticky areas are in place, add items to them

      this.addPins();
    },
    addPins: function addPins() {
      this.pinboards.forEach(function (pinboard, i) {
        // create a duplicate for the component in the source list we want to add
        if (this.pins[i % this.pins.length]) {
          pinboard.appendChild(duplicateItem(this.pins[i % this.pins.length]));
        }
      }.bind(this));
    },
    setContainers: function setContainers() {
      var totalHeight = 0,
          // will start at tertiary area's top padding so we can place containers below it
      intersection,
          spacer,
          rect1,
          rect2,
          containers = [],
          height; // iterate through full bleed components we want to break into the right rail

      this.breakouts.forEach(function (cmpt) {
        rect1 = mezr.rect(cmpt, this.contentArea); // full-bleed cmpt bounding box relative to the top of the article content

        rect2 = mezr.rect(this.rightRail, this.contentArea); // right rail bounding box relative to the top of the article content
        // get the intersection rectangle between the right rail and the current full-bleed component

        intersection = mezr.intersection(rect1, rect2);

        if (intersection) {
          height = intersection.top - totalHeight; // get the height of the container itself

          spacer = document.createElement('div');
          this.rightRail.appendChild(spacer);
          spacer.style.height = height + 'px';
          spacer.style.marginBottom = intersection.height + bottomMargin + 'px'; // add bottom margin that blocks out space for the full-bleed component to break into the right rail

          spacer.classList.add('spacer');
          containers.push(spacer);
          totalHeight += height + intersection.height + bottomMargin; // increment the total height so we know how high to make the next container
        }
      }.bind(this)); // add a flexible height container below the last breakout component
      // or, if there are no breakout components, add a single container

      spacer = document.createElement('div');
      this.rightRail.appendChild(spacer);
      spacer.classList.add('spacer');
      containers.push(spacer);
      return containers;
    },
    populatePinsList: function populatePinsList() {
      var pinItems = Array.from(this.rightRail.children),
          item,
          i,
          content;

      for (i = 0; i < pinItems.length; i++) {
        item = pinItems[i];
        content = item.classList.contains('clay-space') ? getItemFromSpace(item) : item; // grab the actual component from the space if the item is a space

        if (content && content.offsetParent) {
          // if the space isn't empty
          this.rightRail.removeChild(item); // remove it from the right rail to make room for containers

          if (content) {
            // add it to the list if there's something in it
            this.pins.push(content);
          }
        }
      } // unhide the component now that it's empty
      // its hidden on load to avoid ads appearing then quickly disappearing on load


      this.rightRail.classList.remove('hide-all');
    },
    setNumPinboards: function setNumPinboards(contentAreaHeight) {
      // set the number of sticky areas based on the height of the container
      return Math.round(contentAreaHeight / (Math.max(this.nextPinHeight, this.firstPinHeight) + bottomMargin));
    }
  };
  return Constructor;
}]);
}, {"1":1,"41":41,"194":194,"sticky-container.client":"sticky-container.client"}];
