window.modules["45"] = [function(require,module,exports){'use strict';
/*
  Only css used for animation is inlined. The speed and linear shape of the animations
  are set in the css rule transition property. Using transitionEnd to hide the animation
  DOMs because the fade out needs to be complete before moving everything back to zIndex -1.
  Inlined styles are removed from dom after use because they affect other zIndex values on page.
  Adding classes to the array imgClassesBlocked will prevent those images from zooming.
  Image Zoom service not used on Strategist.
 */

var _this = void 0;

var dom = require(1),
    throttle = require(23),
    _require = require(116),
    getSiteName = _require.getSiteName,
    body = dom.find('body'),
    imgClassesBlocked = ['image-reveal', 'zoom-block', 'image-zoom-container', 'brand-url', 'secondary-area'],
    globalNav = dom.find('.global-nav'),
    pageStickyHeader = dom.find('.page-sticky-header'),
    pageStickyHeaderHeight = pageStickyHeader.getBoundingClientRect().height,
    globalNavHeight = globalNav.getBoundingClientRect().height,
    overlay = insertClassyDom('div', 'image-zoom-overlay'),
    mainContent = dom.find('section.main'),
    imageZoomContainer = insertClassyDom('img', 'image-zoom-container'),
    imageZoomDom = insertClassyDom('div', 'image-zoom-stage');

var imgZoomCss,
    imgZoom,
    originalCssString,
    verticalPadding,
    horizontalPadding,
    zoomActive = false,
    isInitialised = false;

function currentWindow() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    centerX: Math.floor(window.innerWidth / 2),
    centerY: Math.floor(window.innerHeight / 2),
    scrollY: window.scrollY,
    ratio: window.innerWidth / window.innerHeight
  };
}

function currentPadding() {
  verticalPadding = window.getComputedStyle(imageZoomContainer, null).getPropertyValue('--verticalPadding') || 70, horizontalPadding = window.getComputedStyle(imageZoomContainer, null).getPropertyValue('--horizontalPadding') || 100;
}

function attachZoomClassClick() {
  var imgDoms = document.body.getElementsByTagName('IMG');

  for (var i = 0; i < imgDoms.length; i++) {
    if (isEligible(imgDoms[i])) {
      imgDoms[i].classList.add('image-zoom');
      imgDoms[i].addEventListener('click', function (ev) {
        return toggleImageZoom(ev);
      });
    }
  }
}

function toggleImageZoom(ev) {
  if (body.classList.contains('disabled') || imgClassesBlocked.filter(function (blockClass) {
    return ev.target.classList.contains(blockClass);
  }).length > 0 || ev.target.tagName !== 'IMG' || zoomActive) {
    unZoomImage();
    return;
  }

  imgZoom = ev.target;
  imgZoomCss = imgZoom.getBoundingClientRect();
  imgZoomCss.ratio = imgZoomCss.width / imgZoomCss.height;
  imgZoomCss.centerY = imgZoomCss.top + Math.ceil(imgZoomCss.height / 2);
  imgZoomCss.centerX = imgZoomCss.left + Math.ceil(imgZoomCss.width / 2);
  Object.assign(imageZoomContainer.style, {
    top: imgZoomCss.top + currentWindow().scrollY + 'px',
    left: imgZoomCss.left + 'px',
    width: imgZoomCss.width + 'px',
    height: imgZoomCss.height + 'px'
  });
  imageZoomContainer.classList.add('forward');
  globalNav.style.transform = 'translateY(-' + globalNavHeight + 'px)';
  pageStickyHeader.style.transform = 'translateY(-' + (globalNavHeight + pageStickyHeaderHeight) + 'px)';
  imageZoomContainer.src = imgZoomSrc(imgZoom);
}

function imgZoomSrc(imgDom) {
  return imgDom.parentNode.nodeName === 'PICTURE' ? imgDom.currentSrc : imgDom.src;
}

function insertClassyDom(domString, classToAdd) {
  var newDom = document.createElement(domString);
  newDom.className = classToAdd;
  return newDom;
}
/**
 * A white frame around zoomed image set in horizontalPadding & verticalPadding.
 * The values are stored in /components/image-zoom.css and change according to viewport.
 * 'scale' value from a ternary to determine which is the longest side on image for scaling
 * @type {Object}
 */


function zoomUp() {
  var windowDimensions = currentWindow();
  var scale = windowDimensions.ratio >= imgZoomCss.ratio ? (windowDimensions.height - 2 * verticalPadding) / imgZoomCss.height : (windowDimensions.width - 2 * horizontalPadding) / imgZoomCss.width,
      newLocationX = (windowDimensions.centerX - imgZoomCss.centerX) / scale,
      newLocationY = (windowDimensions.centerY - imgZoomCss.centerY) / scale;
  overlayShow();
  imgZoom.classList.add('transparent');
  mainContent.classList.add('zoom-active'); // store original css for animating back to these values

  originalCssString = imageZoomContainer.style.cssText;
  imageZoomContainer.style.transform = 'scale(' + scale + ') translate(' + newLocationX + 'px,' + newLocationY + 'px)';
}

function zoomDown() {
  imageZoomContainer.style.cssText = originalCssString;
}

function unZoomImage() {
  if (!zoomActive) {
    return;
  }

  pageStickyHeader.style.removeProperty('transform');
  globalNav.style.removeProperty('transform');
  overlayHide();
  zoomDown();
}

function overlayShow() {
  overlay.classList.add('forward', 'show-shade');
  zoomActive = true;
}

function overlayHide() {
  overlay.classList.remove('show-shade');
  mainContent.classList.remove('zoom-active');
  zoomActive = false;
}

function checkOverlayTransition(e) {
  if (e.propertyName === 'opacity' && e.target.classList.contains('image-zoom-overlay') && !zoomActive) {
    imgZoom.classList.remove('transparent');
    overlay.classList.remove('forward');
    imageZoomContainer.classList.remove('forward');
    imageZoomContainer.src = '';
  }
}
/**
 * Travel up the ancestor parent node chain and return
 * false  based on class or tag.
 * Classes set in imgClassesBlocked array.
 * @param {Element} imgDom
 * @returns {boolean}
 */


function isEligible(imgDom) {
  while (imgDom) {
    if (imgDom.tagName === 'A' || imgDom.classList && imgClassesBlocked.filter(function (blockClass) {
      return imgDom.classList.contains(blockClass);
    }).length > 0) {
      return false;
    }

    imgDom = imgDom.parentNode;
  }

  return true;
}

module.exports = function (el) {
  if (isInitialised || getSiteName() === 'The Strategist') {
    return;
  }

  imageZoomContainer.setAttribute('style', 'transform: scale(1) translate(0px, 0px)');
  imageZoomDom.appendChild(overlay);
  imageZoomDom.appendChild(imageZoomContainer);
  window.addEventListener('scroll', throttle(unZoomImage.bind(_this), 200));
  window.addEventListener('resize', throttle(function () {
    unZoomImage.bind(_this);
    currentPadding.bind(_this);
  }, 200));
  imageZoomContainer.addEventListener('load', function () {
    return zoomUp();
  });
  overlay.addEventListener('transitionend', function (e) {
    return checkOverlayTransition(e);
  });
  imageZoomDom.addEventListener('click', function (ev) {
    return toggleImageZoom(ev);
  });
  el.appendChild(imageZoomDom);
  attachZoomClassClick();
  currentPadding();
  isInitialised = true;
};
}, {"1":1,"23":23,"116":116}];
