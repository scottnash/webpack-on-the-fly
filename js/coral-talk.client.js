window.modules["coral-talk.client"] = [function(require,module,exports){'use strict';

var dom = require(1),
    store = require(96),
    visibility = require(26),
    auth0 = require(7),
    TALK_AUTH = 'talk:auth_token';

var hasEmbedScriptLoaded = false,
    hasCoralTalkRendered = false,
    coralEmbed;
/**
 * render comments if they're ready
 * note: this will ALWAYS render comments, even if reader is not logged in
 * @param {object} options
 */

function renderComments(options) {
  if (hasEmbedScriptLoaded && !hasCoralTalkRendered) {
    var renderOptions = {
      talk: "".concat(window.location.protocol, "//").concat(options.CORAL_TALK_HOST),
      // note: auth_token will be undefined if reader isn't logged in.
      // coral talk is fine with this, and will display the correct UX affordances
      auth_token: store.get(TALK_AUTH),
      asset_url: options.TALK_ASSET_URL
    };
    hasCoralTalkRendered = true; // don't render coral talk twice!

    coralEmbed = window.Coral.Talk.render(options.commentStreamContainer, renderOptions);
  }
}
/**
 * if we've already rendered coral-talk for an anonymous user,
 * trigger a login when the user has logged in via auth0
 */


function coralLogin() {
  coralEmbed.login(store.get(TALK_AUTH));
}
/**
* embed the coral talk script dynamically
* @param {string} src URL of script
* @param {object} options
*/


function embedScript(src, options) {
  var scriptEl = document.createElement('script');
  scriptEl.type = 'text/javascript';
  scriptEl.async = true;
  scriptEl.src = src;
  scriptEl.addEventListener('load', function () {
    hasEmbedScriptLoaded = true;
    renderComments(options);
  });
  document.getElementsByTagName('head')[0].appendChild(scriptEl);
}
/**
 * attempt to embed the coral talk script and render comments
 * @param  {object} options
 */


function attemptScriptEmbedding(options) {
  if (!hasEmbedScriptLoaded) {
    embedScript(options.EMBED_URL, options); // embed coral talk script
  } else {
    renderComments(options); // render comments if we've already loaded the embed script
  }
}
/**
 * only embed the Coral Talk scripts once the reader has reached the bottom
 * of their article (or if they've scrolled down to the coral-talk component)
 * @param {Element} el root component element
 * @param {object} options
 * @param {string} options.scriptUrl
 */


function addVisibilityListener(el, options) {
  // only embed the Coral Talk scripts once the reader has reached the bottom
  // of their article (or if they've scrolled down to the coral-talk component)
  var visible = new visibility.Visible(el, {
    preloadThreshold: 750
  }); // trigger script embedding when reader is about to scroll into comment area

  visible.on('preload', function () {
    return attemptScriptEmbedding(options);
  });
}
/**
 * remove the sign in button
 * happens when authenticating, and on page load when the session hasn't expired
 * @param  {Element} signInButton
 */


function removeSignInButton(signInButton) {
  if (signInButton && signInButton.parentNode) {
    dom.removeElement(signInButton);
  }
}
/**
 * initialization function for coral-talk comments
 * @param  {Element} el
 */


function init(el) {
  var CORAL_TALK_HOST = el.getAttribute('data-coral-talk-host'),
      EMBED_URL = "".concat(window.location.protocol, "//").concat(CORAL_TALK_HOST, "/embed.js"),
      pageUri = document.documentElement.getAttribute('data-uri'),
      TALK_ASSET_URL = "http://".concat(pageUri, ".html"),
      isMaintenanceMode = el.getAttribute('data-maintenance') === 'true',
      isPublishedPage = TALK_ASSET_URL.indexOf('@published') !== -1,
      commentStreamContainer = el.querySelector('.coral-talk-container'),
      signInButton = el.querySelector('.coral-talk-btn-signin'),
      options = {
    CORAL_TALK_HOST: CORAL_TALK_HOST,
    EMBED_URL: EMBED_URL,
    commentStreamContainer: commentStreamContainer,
    signInButton: signInButton,
    TALK_ASSET_URL: TALK_ASSET_URL
  }; // disable comments if they're down for maintenance
  // and only display comments on published pages

  if (isMaintenanceMode || !isPublishedPage) {
    return;
  }

  auth0.on('init', function () {
    // set up visibility listener to kick off script embedding / loading
    addVisibilityListener(el, options); // add click handler to sign in button

    signInButton.addEventListener('click', function () {
      return auth0.showLogin();
    }); // if we're already authenticated, remove the sign in button

    if (auth0.isAuthenticated()) {
      removeSignInButton(signInButton);
    }
  }); // check authentication to show/hide the login button
  // and set the jwt for coral talk

  auth0.on('login', function (profile, expiration) {
    removeSignInButton(signInButton); // set jwt and persist to a localStorage, removing it when it has expired

    store.set(TALK_AUTH, profile['http://nymag.com/coral_talk'], expiration); // trigger script embedding immediately if reader has already scrolled to comment area
    // before logging in

    if (visibility.isElementInViewport(el)) {
      attemptScriptEmbedding(options);
    } // if coral talk has already rendered anonymously, trigger a login on the embed


    if (hasCoralTalkRendered) {
      coralLogin();
    }
  }); // if the reader logs out, also remove the coral talk JWT

  auth0.on('logout', function () {
    store.remove(TALK_AUTH);
  });
}

module.exports = init;
}, {"1":1,"7":7,"26":26,"96":96}];
