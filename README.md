# Passport Auth0 OpenID Connect

[Passport](https://github.com/jaredhanson/passport) strategy for authenticating
with [Auth0](https://auth0.com) using [OpenID Connect](http://openid.net/connect/).

This module lets you authenticate using Auth0 in your Node.js applications. By plugging into Passport, OpenID Connect authentication can be easily and unobtrusively integrated into any application or framework that
supports [Connect](http://www.senchalabs.org/connect/)-style middleware, including [Express](http://expressjs.com/).

This Auth0 OpenID Connect strategy is based on the [passport-openidconnect](https://github.com/jaredhanson/passport-openidconnect) strategy.

## Installation

```sh
npm install passport-auth0-openidconnect --save
```

## Configuration

Copy your credentials from your App's setting within the [Auth0 Dashboard](https://manage.auth0.com) and initialize the strategy as follows:

```js
var passport  = require('passport');
var Strategy  = require('passport-auth0-openidconnect').Strategy;

passport.use(new Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  function(issuer, audience, profile, cb) {
    //not interested in passport profile normalization, 
    //just the Auth0's original profile that is inside the _json field
    return cb(null, profile._json);
  }));
```

You can add more params to the callback in case you need to grab a **refreshToken** or **id_token**.

You can also use the `passReqToCallback` option to make the request available in the callback function. This is useful if you need to access the **session**.

```js
passport.use(new Strategy({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL,
    passReqToCallback: true
  },
  function(req, issuer, audience, profile, accessToken, refreshToken, params, cb) {
    
    console.log('issuer',issuer); // https://your-domain.auth0.com/
    console.log('audience',audience); // user's id. i.e: auth0|5633afe0794d1c5a0b72a2be
    console.log('accessToken',accessToken); // QSs...emeU
    console.log('refreshToken',refreshToken); // gAUqAgTPr...dOquQxQ
    console.log('params',params); // { access_token: 'QSs...meU',
                                  //    id_token: 'eyJ0eXAi...t7j-e_0',
                                  //    token_type: 'Bearer' }
    
    //save parameters in session as needed                              
    req.session.id_token = params.id_token;

    //not interested in passport profile normalization, 
    //just the Auth0's original profile that is inside the _json field
    return cb(null, profile._json);
  }));
```

## Usage

```js

// show the index page, which uses Lock to authenticate to Auth0
app.get('/', function (req, res) {
  res.render('index', env);
});

//handle the login callback using auth0-oidc srategy
app.get('/callback',
  passport.authenticate('auth0-oidc'), function (req, res) {
    res.redirect('/user');
  }
);

//user must be authenticated to access the user's page.
app.get('/user',
  require('connect-ensure-login').ensureLoggedIn('/'),
  function(req, res){
    res.render('user', { user: req.user });
  });
```

## Example

You can find a complete example of a Node.js Regular Web App using the **passport-auth0-oidc** strategy in the [examples/login folder](./examples/login/README.md).

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, amont others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free Auth0 Account

1. Go to [Auth0](https://auth0.com) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
