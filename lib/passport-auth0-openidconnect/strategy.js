/**
 * Module dependencies.
 */
var util = require('util');
var xtend = require('xtend');
var OpenIDConnectStrategy = require('passport-openidconnect').Strategy;

/**
 * `Strategy` constructor.
 *
 * The auth0-oidc authentication strategy authenticates requests by delegating to
 * an Auth0 account using the OpenID Connect protocol.
 *
 * Options:
 *   - `domain`        your Auth0 Account's domain
 *   - `clientID`      your Auth0 App's clientID
 *   - `clientSecret`  your Auth0 App's clientSecret
 *   - `callbackURL`   URL to which Auth0 will redirect the user after granting authorization
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  ['domain',
  'clientID',
  'clientSecret',
  'callbackURL'].forEach(function (k) {
    if(!options[k]){
      throw new Error('You must provide the ' + k + ' configuration value to use passport-auth0-oidc.');
    }
  });

  options = xtend({}, options, {
    authorizationURL: 'https://' + options.domain + '/authorize',
    tokenURL:         'https://' + options.domain + '/oauth/token',
    userInfoURL:      'https://' + options.domain + '/userinfo'
  });

  OpenIDConnectStrategy.call(this, options, verify);

  this.name = 'auth0-oidc';
  
}

/**
 * Inherit from `OpenIDConnectStrategy`.
 */
util.inherits(Strategy, OpenIDConnectStrategy);

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;