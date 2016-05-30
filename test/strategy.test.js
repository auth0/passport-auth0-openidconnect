var Auth0OidcStrategy = require('../lib/passport-auth0-openidconnect').Strategy;
var assert = require('assert');

describe('constructor with bad params', function () {

  it('should fail if no domain is passed as option',function(){
    (function(){
      new Auth0OidcStrategy(
        {},
        function(accessToken, idToken, profile, done){}
      );
    }).should.throw('You must provide the domain configuration value to use passport-auth0-oidc.');
  });

  it('should fail if no clientID is passed as option',function(){
    (function(){
      new Auth0OidcStrategy(
        {domain:'foo'},
        function(accessToken, idToken, profile, done){}
      );
    }).should.throw('You must provide the clientID configuration value to use passport-auth0-oidc.');
  });

  it('should fail if no clientSecret is passed as option',function(){
    (function(){ 
      new Auth0OidcStrategy(
        {domain:'foo',clientID:'bar'},
        function(accessToken, idToken, profile, done){}
      );
    }).should.throw('You must provide the clientSecret configuration value to use passport-auth0-oidc.');
  });

  it('should fail if no callbackURL is passed as option',function(){
    (function(){
      new Auth0OidcStrategy(
        {domain:'foo',clientID:'bar',clientSecret:'baz'},
        function(accessToken, idToken, profile, done){}
      );
    }).should.throw('You must provide the callbackURL configuration value to use passport-auth0-oidc.');
  });
});

describe('constructor with right params and pre-configured endpoints', function () {
  var strategy, configuration;

  before(function () {
    strategy = new Auth0OidcStrategy({
       domain:       'jj.auth0.com',
       clientID:     'testid',
       clientSecret: 'testsecret',
       callbackURL:  '/callback',
       authorizationURL: 'https://jj.auth0.com/authorize',
       tokenURL:     'https://jj.auth0.com/oauth/token',
       userInfoURL:  'https://jj.auth0.com/userinfo'
      },
      function(accessToken, idToken, profile, done) {}
    );

    strategy._configurers.should.have.length(1);
    strategy._configurers[0](null, function (err, config) {
      configuration = config;
    });
  });

  it('should be named auth0-oidc',function(){
    strategy.name.should.eql('auth0-oidc');
  });

  it('oidc authorizationURL should be properly set', function () {
    configuration.authorizationURL.should.eql('https://jj.auth0.com/authorize');
  });
  
  it('oidc tokenURL should be properly set', function () {
    configuration.tokenURL.should.eql('https://jj.auth0.com/oauth/token');
  });
  
  it('oidc userInfoURL should be properly set', function () {
    configuration.userInfoURL.should.eql('https://jj.auth0.com/userinfo');
  });

  it('oidc clienID should be properly set',function(){
    configuration.clientID.should.eql('testid');
  });

  it('oidc clientSecret should be properly set',function(){
    configuration.clientSecret.should.eql('testsecret');
  });

  it('oidc callbackURL should be properly set',function(){
    configuration.callbackURL.should.eql('/callback');
  });

  it('oidc skipUserProfile should default to false',function(){
    strategy._skipUserProfile.should.be.false();
  });

});