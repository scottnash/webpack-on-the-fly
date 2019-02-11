window.modules["interactive-tiles.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    $visibility = require(26),
    $popup = require(40);

DS.controller('interactive-tiles', ['adService', function (adService) {
  var styleSelect = require(130),
      toArray = require(140),
      debounce = require(107),
      lastNodeInRow = require(136),
      stick = require(139),
      getQueryParam = function getQueryParam(param) {
    return (location.search.match(new RegExp(param + '=(.*?)($|\&)', 'i')) || [])[1];
  },
      State = require(141),
      FrameResizer = require(137),
      toggleClass = function toggleClass(el, classname, condition) {
    var contains = el.classList.contains(classname);
    if (contains && !condition) el.classList.remove(classname);
    if (!contains && condition) el.classList.add(classname);
  };

  function Constructor(el) {
    var queryParamTile = getQueryParam('tile'),
        tileElements = toArray(el.querySelectorAll('.tile')),
        detailElements = toArray(el.querySelector('.details').children),
        mobileTopic = el.getAttribute('data-mobile-topic') || 'all',

    /* State represents the application state. It is an object that emits events when
     * its properties are changed via state.change(propName, newVal).
     * You can subscribe to property changes with with state.on(propName, function(oldVal, newVal){...}) */
    state = new State({
      openedTile: false,
      // The ID of the open tile (i.e. its index in tileData). False if no tile is open.
      shownTiles: [],
      filter: 'all',
      // The filtered topic, or "all" if there is no filter
      tileData: tileElements.map(function (el, index) {
        // A cache of tile data.
        return new State({
          el: el,
          id: index,
          topics: el.getAttribute('data-topics').split(','),
          detailHtml: detailElements[index].innerHTML.replace('<!--', '').replace('-->', ''),
          displayImage: false,
          absoluteId: el.getAttribute('data-absolute-id')
        });
      }),
      windowWidth: window.innerWidth
    }),
        keyMap = {
      27: function _() {
        // escape
        state.actions.closeTile();
      },
      37: function _() {
        // left arrow
        if (typeof state.openedTile === 'number') {
          state.actions.prevTile();
        }
      },
      39: function _() {
        // right arrow
        if (typeof state.openedTile === 'number') {
          state.actions.nextTile();
        }
      }
    }; // Actions are functions that change the state in some way, often modifying several
    // properties or performing some kind of logic.

    state.actions = require(138)(state); // We only use these elements to pass interactive-tile HTML into state's tileData property, so we remove them here

    dom.removeElement(el.querySelector('.details')); // Initilize micro-components. See below.

    new Root(el, state);
    new Nav(el.querySelector('.int-nav'));
    toArray(el.querySelectorAll('.topic-explainer')).forEach(function (el) {
      new TopicExplainer(el, state);
    });
    new TopicSelector(el.querySelector('.topic-selector'), state);
    new BtnRandom(el.querySelector('.btn-random'), state);
    new BottomTopicSelector(el.querySelector('.another-topic'), state);
    toArray(el.querySelectorAll('.another-topic button')).forEach(function (el) {
      new BottomTopicBtn(el, state);
    });
    state.tileData.forEach(function (tile, index) {
      new Tile(tile.el, state, index);
    });
    new DetailViewer(el.querySelector('.detail-viewer'), state);
    new IframePen(el.querySelector('.iframe-pen'), state);
    new BtnBack(el.querySelector('.btn-back'), state);
    new BtnNext(el.querySelector('.btn-next'), state);
    new BtnClose(el.querySelector('.btn-close'), state);
    new AdControl(el.querySelector('.tiles'), state); // Top-level reactions

    state.on('openedTile', function (oldVal, newVal) {
      // Change URL to match open tile
      window.history.replaceState({
        openedTile: state.openedTile
      }, '', window.location.pathname + (typeof newVal === 'number' ? '?tile=' + state.tileData[newVal].absoluteId : ''));
    }).on('openedTile', function (oldVal, newVal) {
      // If the opened element is not in the viewport, scroll to it
      var tileElement;
      if (newVal === false) return;
      tileElement = state.tileData[newVal].el;

      if (!$visibility.isElementInViewport(tileElement)) {
        window.scrollTo(0, tileElement.getBoundingClientRect().top + window.pageYOffset - 100);
      }
    }).on('filter', function () {
      if (window.pageYOffset > el.getBoundingClientRect().top) {
        window.scrollTo(0, el.getBoundingClientRect().top + window.pageYOffset);
      }
    }); // On window resize, update window width

    window.addEventListener('resize', debounce(function () {
      state.change('windowWidth', window.innerWidth);
    }, 400)); // if window width changes, re-opened the opened tile

    state.on('windowWidth', function () {
      var tile = state.openedTile;

      if (tile !== false) {
        state.actions.closeTile();
        state.actions.openTile(tile);
      }
    }); // Initialize keymap

    window.addEventListener('keyup', function (e) {
      var fnc = keyMap[e.keyCode];
      if (fnc) fnc();
    });

    if (!queryParamTile && window.innerWidth <= 768) {
      state.actions.filterTopic(mobileTopic);
    } else {
      state.actions.filterTopic('all');
    } // If there is a tile queryParam, open the corresponding tile


    if (queryParamTile) {
      state.actions.openTileByAbsoluteId(queryParamTile);
    }
  } // end DS.controller

  /**
   * MICRO-COMPONENTS
   * These objects receive an HTML container and the application state.
   * They listen for changes to the state and react accordingly.
   * They also modify the state if the user interacts with them.
   * They should only modify their own elements (not those of parents,
   * siblings, or child components).
   */


  function Root(el, state) {
    var detailViewer = el.querySelector('.detail-viewer');
    state.on('filter', function (oldVal, newVal) {
      // Hide ads on all filters
      // TODO: Should ads be repositioned on filters? Then their positioning logic
      // must be in client JS, not template
      toggleClass(el, 'filtered', newVal !== 'all');
    }).on('openedTile', function (oldVal, newVal) {
      if (typeof newVal === 'number') {
        // Move the detail viewer to appear after the last element in the opened tile's row
        dom.insertAfter(detailViewer, lastNodeInRow(state.tileData[newVal].el), '.int-ad');
      }
    });
  }

  function Nav(el) {
    stick(el); // Make this sticky
  }

  function TopicSelector(el, state) {
    // "Fake" this select element in JS/CSS so that it can be fully styled. See http://mikemaccana.github.io/styleselect
    styleSelect(el);
    el.addEventListener('change', function () {
      state.actions.filterTopic(el.value);
    });
    state.on('filter', function (oldVal, newVal) {
      var styleSelectNode = el.parentNode.querySelector('.style-select');
      el.value = newVal; // Remove and reinitialize styleSelect instance so it appropriately reacts to external changes
      // to the "filter" state.

      if (styleSelectNode) {
        dom.removeElement(styleSelectNode);
      }

      styleSelect('.interactive-tiles select');
    });
  }

  function TopicExplainer(el, state) {
    var topicId = el.getAttribute('data-topic-id');
    state.on('filter', function (oldVal, newVal) {
      toggleClass(el, 'hidden', newVal !== topicId);
    });
  }

  function BtnRandom(el, state) {
    el.addEventListener('click', function () {
      state.actions.openRandomTile();
    });
  }

  function Tile(el, state, tileId) {
    var thumbContainer = el.querySelector('.tile-thumb-container'),
        visible;
    el.addEventListener('click', function () {
      state.actions.openTile(tileId);
    }, false);
    state.on('openedTile', function (oldVal, newVal) {
      toggleClass(el, 'opened', newVal === tileId);
      toggleClass(el, 'faded', typeof newVal === 'number' && newVal !== tileId);
    }).on('shownTiles', function (oldVal, newVal) {
      var shownIndex = newVal.indexOf(tileId),
          i;
      if (visible) visible.destroy();
      toggleClass(el, 'hidden', shownIndex === -1); // For the first shown tile, and every 20th shown tile...

      if (shownIndex > -1 && (shownIndex === 0 || (shownIndex + 1) % 20 === 0)) {
        // ...track its visibiliity, and when it becomes visible, load its
        // thumbnail and the thumbnails of the next 20 tiles.
        visible = new $visibility.Visible(el, {
          preloadThreshold: 200
        });
        visible.on('preload', function () {
          var l = Math.min(shownIndex + 20, state.shownTiles.length);

          for (i = shownIndex; i < l; i++) {
            if (state.tileData[newVal[i]].change('displayImage', true)) ;
          }

          visible.destroy();
          visible = null;
        });
      }
    });
    state.tileData[tileId].on('displayImage', function (oldVal, newVal) {
      if (newVal === true) {
        thumbContainer.innerHTML = thumbContainer.innerHTML.replace('<!--', '').replace('-->', '');
      }
    });
  }

  function IframePen(el, state) {
    var smartIframe;
    state.on('openedTile', function (oldVal, newVal) {
      if (smartIframe) {
        smartIframe.remove();
        smartIframe = null;
      }

      if (typeof newVal !== 'number') return;
      smartIframe = new SmartIframe(el, state.tileData[newVal].detailHtml, '.interactive-tile');
      new Detail(smartIframe.document.querySelector('.interactive-tile'));
    });
  }
  /**
   * Generates an iFrame child of @appendTo with @html,
   * automatically resizing according to the first element
   * of @html matching @sizeToSelector.
   * @param {HtmlElement} appendTo [description]
   * @param {String} html     [description]
   * @param {String} sizeToSelector   [description]
   * @return {Object}
   */


  function SmartIframe(appendTo, html, sizeToSelector) {
    this.el = generateIframe(appendTo, html);
    this.document = this.el.contentWindow.document;
    this.resizer = new FrameResizer(this.el, this.document.querySelector(sizeToSelector), {
      padding: 25
    });
    this.resizer.resize();
    return this;
  }

  SmartIframe.prototype.remove = function () {
    dom.removeElement(this.el);
    this.resizer.kill();
  };

  function Detail(el) {
    el.querySelector('.btn-facebook').addEventListener('click', function () {
      var conf = {
        picture: el.getAttribute('data-facebook-image'),
        caption: el.getAttribute('data-facebook-caption'),
        description: el.getAttribute('data-facebook-description'),
        name: el.getAttribute('data-facebook-title'),
        method: 'feed',
        link: window.location.href
      }; // see https://developers.facebook.com/docs/javascript/reference/FB.ui

      FB.ui(conf);
    });
    el.querySelector('.btn-twitter').addEventListener('click', function () {
      var text = el.getAttribute('data-twitter-title'),
          via = encodeURIComponent('SelectAll'),
          url = encodeURIComponent(window.location.href);
      $popup.popWindow('twitter', 'selectall', 'https://twitter.com/share?text=' + text + '&amp;url=' + url + 'via=' + via);
    }); // Set target of all links to _blank to prevent any from opening inside the iframe itself

    toArray(el.querySelectorAll('a')).forEach(function (a) {
      a.setAttribute('target', '_blank');
    });
  }

  function DetailViewer(el, state) {
    state.on('openedTile', function (oldVal, newVal) {
      toggleClass(el, 'hidden', newVal === false); // hide or show the detail viewer
    });
  }
  /**
   * Generates an iFrame and appends it to @target,
   * writing @html into it, and copying HEAD styles from
   * the current page to its HEAD.
   * @param  {HtmlElement} target
   * @param  {String} html
   * @return {HtmlElement} - The iFrame node
   */


  function generateIframe(target, html) {
    var doc, iframe;
    iframe = document.createElement('IFRAME');
    iframe.width = '100%';
    iframe.height = 500;
    iframe.frameBorder = 0;
    iframe.scrolling = 'no';
    target.appendChild(iframe);
    doc = iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close(); // copy styles

    toArray(document.querySelectorAll('head style')).forEach(function (style) {
      doc.querySelector('head').appendChild(style.cloneNode(true));
    });
    return iframe;
  }

  function BtnClose(el, state) {
    el.addEventListener('click', function () {
      state.actions.closeTile();
    });
  }

  function BtnNext(el, state) {
    state.on('openedTile', function (oldVal, newVal) {
      toggleClass(el, 'disabled', state.shownTiles.indexOf(newVal) === state.shownTiles.length - 1);
    });
    el.addEventListener('click', function () {
      state.actions.nextTile();
    });
  }

  function BtnBack(el, state) {
    state.on('openedTile', function (oldVal, newVal) {
      toggleClass(el, 'disabled', state.shownTiles.indexOf(newVal) === 0);
    });
    el.addEventListener('click', function () {
      state.actions.prevTile();
    });
  }

  function BottomTopicSelector(el, state) {
    state.on('filter', function (oldVal, newVal) {
      toggleClass(el, 'hidden', newVal === 'all');
    });
  }

  function BottomTopicBtn(el, state) {
    var topic = el.getAttribute('data-topic');
    el.addEventListener('click', function () {
      state.actions.filterTopic(topic);
    });
    state.on('filter', function (oldVal, newVal) {
      toggleClass(el, 'hidden', newVal === topic);
    });
  }

  function AdControl(el, state) {
    // eslint-disable-line
    var i,
        adId = 0,
        insertAdAfter = function insertAdAfter(afterEl) {
      var wrapper = document.createElement('div'),
          id = 'int-ad' + adId++,
          visible;
      wrapper.setAttribute('id', id);
      wrapper.classList.add('int-ad');
      dom.insertAfter(wrapper, afterEl); // only load the ad when its wrapper becomes visible

      visible = new $visibility.Visible(wrapper, {
        preloadThreshold: 200
      });
      visible.on('preload', function () {
        adService.load({
          data: {
            id: id,
            label: 'outStreamDesktop',
            loaded: false,
            name: '/4088/Select_All',
            sizes: function () {
              if (window.innerWidth < 728) return [[300, 250]];
              if (window.innerWidth < 1024) return [[728, 90]];
              return [[970, 90], [728, 90]];
            }()
          }
        });
      });
      return wrapper;
    },
        update = function update(oldVal, shownTiles) {
      var ads = el.querySelectorAll('.int-ad');

      for (i = 0; i < ads.length; i++) {
        dom.removeElement(ads[i]);
      }

      shownTiles.forEach(function (tileId, tileIndex) {
        if (window.innerWidth < 600 && (tileIndex + 1) % 20 === 0) {
          insertAdAfter(state.tileData[tileId].el);
        }

        if (window.innerWidth >= 600 && (tileIndex + 1) % 40 === 0) {
          insertAdAfter(state.tileData[tileId].el);
        }
      });
    };

    state.on('shownTiles', update);
    state.on('windowWidth', function () {
      update(null, state.shownTiles);
    });
    update(null, state.shownTiles);
  }

  return Constructor;
}]);
}, {"1":1,"26":26,"40":40,"107":107,"130":130,"136":136,"137":137,"138":138,"139":139,"140":140,"141":141}];
