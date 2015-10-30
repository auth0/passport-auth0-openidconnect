require('dotenv-safe').load();

var express   = require('express');
var passport  = require('passport');
var path      = require('path');
var Strategy  = require('../../lib/passport-auth0-openidconnect').Strategy;

// Configure the Twitter strategy for use by Passport.
//
// OAuth 1.0-based strategies require a `verify` function which receives the
// credentials (`token` and `tokenSecret`) for accessing the Twitter API on the
// user's behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.

// simple configuration
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

// configuration options for using all the callback arguments
// passport.use(new Strategy({
//     domain: process.env.AUTH0_DOMAIN,
//     clientID: process.env.AUTH0_CLIENT_ID,
//     clientSecret: process.env.AUTH0_CLIENT_SECRET,
//     callbackURL: process.env.AUTH0_CALLBACK_URL,
//     passReqToCallback: true
//   },
//   function(req, issuer, audience, profile, accessToken, refreshToken, params, cb) {
    
//     console.log('issuer',issuer); // https://your-domain.auth0.com/
//     console.log('audience',audience); // user's id. i.e: auth0|5633afe0794d1c5a0b72a2be
//     console.log('accessToken',accessToken); // QSs...emeU
//     console.log('refreshToken',refreshToken); // gAUqAgTPr...dOquQxQ
//     console.log('params',params); // { access_token: 'QSs...meU',
//                                   //    id_token: 'eyJ0eXAi...t7j-e_0',
//                                   //    token_type: 'Bearer' }
    
//     //save parameters in session as needed                              
//     req.session.id_token = params.id_token;

//     //not interested in passport profile normalization, 
//     //just the Auth0's original profile that is inside the _json field
//     return cb(null, profile._json);
//   }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete profile is serialized
// and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'super-secret', resave: true, saveUninitialized: true }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

// Define routes.

app.get('/', function (req, res) {
  res.render('index', { 
    env: {
      AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
      AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL
    } 
  });
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


app.get('/callback',
  passport.authenticate('auth0-oidc'), function (req, res) {
    res.redirect(req.session.returnTo || '/user');
  }
);


app.get('/user',
  require('connect-ensure-login').ensureLoggedIn('/'),
  function(req, res){
    res.render('user', { user: req.user });
  });

app.listen(3000);
console.log("Listing in http://localhost:3000");