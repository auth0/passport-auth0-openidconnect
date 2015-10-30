var assert = require('assert');
var util = require('util');
var auth0OidcStrategy = require('../lib/passport-auth0-openidconnect');

describe('passport-auth0-openidconnect', function(){

  it('should report a version', function () {
    assert.ok(auth0OidcStrategy.version);
    assert.equal(typeof(auth0OidcStrategy.version),'string');
    assert.ok(auth0OidcStrategy.version.length > 0);
  });

});