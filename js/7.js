window.modules["7"] = [function(require,module,exports){'use strict';

var Eventify = require(143),
    auth0 = require(269),
    store = require(96),
    isProd = require(6)(),
    // note: there's no good way to pass this through without it being accessible,
// but we NEVER expose the client secret in the browser (all JWT signing happens on auth0's end)
AUTH0_CLIENT_ID = isProd ? 'l6GN9FG2cvg2W2e4a7XoOd8WCeiI84Hk' : 'lj0likzfa5GpE06fJxVKcUXxlt3YN76Q',
    AUTH0_DOMAIN = isProd ? 'login.nymag.com' : 'nymedia.auth0.com',
    AUTH0_AUDIENCE = isProd ? 'newyorkmedia.auth0.com' : 'nymedia.auth0.com',
    AUTH0_DB = isProd ? 'nymag' : 'nymag-qa',
    // localStorage keys
AUTH0_AUTH = 'auth0:access_token',
    AUTH0_PROFILE = 'auth0:profile',
    AUTH0_EXPIRATION = 'auth0:expiration',
    // AUTH0_CHECK_TIMEOUT = 10000, // 10 seconds for cross-domain check
enableLog = !isProd || document.location.search.match('auth0Debug'),
    webAuth = new auth0.WebAuth({
  clientID: AUTH0_CLIENT_ID,
  domain: AUTH0_DOMAIN,
  redirectUri: document.location.origin + '/login/',
  audience: "https://".concat(AUTH0_AUDIENCE, "/userinfo"),
  scope: 'openid profile email read:current_user update:current_user_metadata',
  responseType: 'token id_token'
}),
    MAX_32_BIT = 2147483647; // REPORT_HASH_FAIL = 500,
// REPORT_ERR_UNKNOWN = 501;


var tokenRenewalTimeout; // setTimeout for session renewal will be assigned here
// auth0 module will trigger events:
// - init (triggered when auth0-lock is instantiated. other exported methods will NOT be available until then)
// - login (triggered after auth0 authenticates and user profile is fetched)
// - logout (triggered after auth0 has been logged out manually)

Eventify.enable(module.exports);
/**
 * logger used for debug based on context
 * @param {obj} msg
 */

function authlog(msg) {
  enableLog && console.log(msg);
}
/**
 * check current authentication (it's removed based on auth0's expiry)
 * @returns {boolean}
 */


function isAuthenticated() {
  return !!store.get(AUTH0_AUTH);
}
/**
 * get user ID
 * @return {string|undefined}
 */


function getUserID() {
  var profile = store.get(AUTH0_PROFILE);
  return profile && profile.sub;
}
/**
 * get user's email
 * note: to get the email associated with a PCD customer account,
 * use app_metadata.pcd_email instead
 * @return {string|undefined}
 */


function getEmail() {
  var profile = store.get(AUTH0_PROFILE);
  return profile && profile.email;
}
/**
 * get user-editable metadata
 * @return {object|undefined}
 */


function getUserMetadata() {
  var profile = store.get(AUTH0_PROFILE);
  return profile && profile['http://nymag.com/user_metadata'];
}
/**
 * get non-user-editable metadata
 * @return {object|undefined}
 */


function getAppMetadata() {
  var profile = store.get(AUTH0_PROFILE);
  return profile && profile['http://nymag.com/app_metadata'];
}
/**
 * check current user subscription
 * @return {Boolean}
 */


function isSubscriber() {
  var appMeta = getAppMetadata();
  return !!appMeta && appMeta.has_subscription;
}
/**
 * show the login modal
 * call optional cb on completion
 * @param {object} cb
 */


function showLogin() {
  // set reirect back to current url
  webAuth.authorize({
    redirectUri: document.location.origin + '/login/?redirectUri=' + document.location.href
  }); // TODO: cleanup below, should be full redirect
  // so no need for callback logic
  //
  // webAuth.authorize({prompt:'login', redirectUri: document.location.origin + '/login/?redirectUri=' + document.location.href}, function (err,data) {
  //   if (err) {
  //     authlog('Error on auth0 authorize call');
  //     authlog(err);
  //   } else {
  //     login(err, data, cb);
  //   }
  // });
}
/**
 * persist login info to localstorage
 * and start a scheduler to auto-renew tokens
 * @param {object} authResult
 * @param {object} profile
 * @param {Date} expiration
 */


function setSession(authResult, profile, expiration) {
  // access_token and profile will be removed automatically
  // from localStorage after the expiry (set in auth0 app settings)
  store.set(AUTH0_AUTH, authResult.accessToken, expiration);
  store.set(AUTH0_PROFILE, profile, expiration);
  store.set(AUTH0_EXPIRATION, expiration, expiration);
  scheduleRenewal(expiration);
}
/**
 * fetch the user profile (including any JWT we're updating with rules)
 * and trigger 'login' event when authenticating with auth0 servers
 * @param  {Error} err
 * @param  {object} authResult
 * @param  {function} cb is only called when logging in via sso
 * @return {*} returns early with error callback if things error out
 */


function login(err, authResult, cb) {
  var expiration, profile;

  if (err) {
    if (cb) {
      return cb(err);
    } else {
      return;
    }
  } // pull expiration and profile info


  expiration = authResult.expiresIn * 1000 + new Date().getTime();
  profile = authResult.idTokenPayload; // persist information to localstorage

  setSession(authResult, profile, expiration); // trigger login event that components can listen to,
  // adding profile and expiration to make it easy for them to set localStorage data

  module.exports.trigger('login', profile, expiration);

  if (cb) {
    cb();
  }
} // /**
//  * renew session automatically
//  * @param {Integer} code
//  * @param {String} msg
//  */
// function report(code, msg) {
//   var pixel = document.createElement('img');
//
//   pixel.setAttribute('src', 'https://nymag.com/pixel.gif?/pixel.gif?s=0&a0=' + code + '&m=' + encodeURIComponent(msg));
//   document.body.appendChild(pixel);
// }

/**
 * renew session automatically
 * @param {Date} expiration
 */


function scheduleRenewal(expiration) {
  // delay can't exceed base 32 value or setTimeout will invoke immediately
  var delay = expiration && Math.min(expiration - Date.now(), MAX_32_BIT);

  if (expiration && delay > 0) {
    tokenRenewalTimeout = setTimeout(function () {
      return webAuth.checkSession({
        timeout: 15000
      }, login);
    }, delay);
  }
}
/**
 * clear tokens and timer. this is used by logout
 * or when local becomes out of synch with auth0 remote
 */


function clearLocalSession() {
  authlog('clearing local store');
  clearTimeout(tokenRenewalTimeout);
  store.remove(AUTH0_AUTH);
  store.remove(AUTH0_PROFILE);
  store.remove(AUTH0_EXPIRATION);
}
/**
 * log off! (and stop the automatic token renewal)
 */


function logout() {
  authlog('auth0 logging out');
  clearLocalSession(); // return url strips hash and search string to remove
  // any auth creds and prevent double counting of utm

  webAuth.logout({
    clientId: AUTH0_CLIENT_ID,
    returnTo: document.location.origin + '/logout/?redirectUri=' + document.location.origin + document.location.pathname
  }, function (err) {
    if (!err) {
      module.exports.trigger('logout');
    }
  });
}
/**
 * trigger a password reset email, which will contain a link to reset a user's password
 * @param {string} email for the user
 * @return {Promise}
 */


function triggerPasswordReset(email) {
  return new Promise(function (resolve, reject) {
    webAuth.changePassword({
      email: email,
      connection: AUTH0_DB
    }, function (err, resp) {
      if (err) {
        reject(err);
      }

      resolve(resp);
    });
  });
}
/**
 * create a new user in auth0
 * @param  {string} email
 * @param  {string} username
 * @param  {string} password
 * @return {Promise}
 */


function createUser(_ref) {
  var email = _ref.email,
      username = _ref.username,
      password = _ref.password;
  return new Promise(function (resolve, reject) {
    webAuth.signup({
      email: email,
      username: username,
      password: password,
      connection: AUTH0_DB
    }, function (err, res) {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
/**
 * refresh the auth token manually and trigger a new 'login' event
 * (used when updating / linking user data)
 *
 * TODO: This works in context of account page, where it is not
 * a cross-domain call; however, calling refresh in browsers with 3rd
 * party block will fail with 'login_required', which may not be intended
 * user experience. For now, perhaps add same domain check and fallback
 * to localStorage for users not on nymag.com?
 *
 * @return {Promise}
 */


function refresh() {
  return new Promise(function (resolve, reject) {
    webAuth.checkSession({}, function (err, _ref2) {
      var _ref2$idTokenPayload = _ref2.idTokenPayload,
          idTokenPayload = _ref2$idTokenPayload === void 0 ? {} : _ref2$idTokenPayload;

      if (err) {
        if (err.msg == 'login_required') {
          authlog('silent auth: login_required, invalidating local creds'); // user session terminated from auth0 end so clean up, same as logout

          logout();
        } else {
          authlog('silent auth: unknown error: ' + err.error);
          reject(err);
        }
      } // reset user profile


      store.set(AUTH0_PROFILE, idTokenPayload);
      module.exports.trigger('refresh');
      resolve();
    });
  });
}
/**
 * main initialization of auth service and state
 */


function load() {
  if (isAuthenticated()) {
    setTimeout(function () {
      // need to yield to other processes to
      // give chance to catch events
      module.exports.trigger('init');
    }, 0); //
    // TODO: the following block kills browsers with most
    // restrictive blocking (e.g. chrome with 3rd party block enabled)
    // Waiting for solution from auth0
    //
    // have local creds, but make sure remote are valid
    // webAuth.checkSession({}, function (err) {
    //   console.log('authenticated checksession results in:');
    //   if (err) {
    //     if (err.error == 'login_required') {
    //       // logged out from other site, so clear local
    //       clearLocalSession();
    //     } else {
    //       console.log('Unexpected error on checkSession with local creds: ' + err.error); // e.g. timeout, benefit goes to users
    //     }
    //   }
    //   module.exports.trigger('init');
    // });
  } else {
    // not authenticated locally, so check remote/other domains
    webAuth.checkSession({}, function (err, data) {
      if (err) {
        authlog('checkSession err :  ' + err.error);

        if (err.error == 'login_required') {
          // see if we can parse from hash
          authlog('login_required so check hash for creds');
          webAuth.parseHash(function (hashErr, hashData) {
            authlog('processing parseHash result');

            if (hashErr || !hashData) {
              // can
              authlog('Parse hash: no token found: ');
              module.exports.trigger('init'); // if (hashErr) {
              //   report(REPORT_HASH_FAIL, hashErr.error + ': ' + hashErr.errorDescription);
              // }
            } else {
              // success getting token from hash
              login(hashErr, hashData, function () {
                module.exports.trigger('init');
              });
            }
          });
        } else {
          // due to timeout or other non-user error
          clearLocalSession();
          module.exports.trigger('init'); // report(REPORT_ERR_UNKNOWN, 'Unknown error on auth: ' + err.error);
          // we are not triggering since we can't load properly
        }
      } else {
        // successful checkSession flow
        authlog('valid session found on checkSession');
        login(err, data, function () {
          module.exports.trigger('init');
        });
      }
    });
  }
} // NOTE: these methods are not valid until auth initiates,
// so all subscribers to this service should trigger use on init


module.exports.isAuthenticated = isAuthenticated;
module.exports.getUserID = getUserID;
module.exports.getEmail = getEmail;
module.exports.getUserMetadata = getUserMetadata;
module.exports.getAppMetadata = getAppMetadata;
module.exports.isSubscriber = isSubscriber;
module.exports.showLogin = showLogin;
module.exports.logout = logout;
module.exports.triggerPasswordReset = triggerPasswordReset;
module.exports.createUser = createUser;
module.exports.refresh = refresh;
authlog('Loading auth0 - initial localStorage state');
authlog(localStorage);
load();
}, {"6":6,"96":96,"143":143,"269":269}];
