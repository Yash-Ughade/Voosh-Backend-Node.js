const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


const User = require('../models/User');

const handleOAuth = async (profile, provider, done) => {
    try {
      let user = await User.findOne({ socialId: profile.id, provider });
      if (!user) {
        user = new User({
          email: profile.emails[0].value,
          name: profile.displayName,
          photo: profile.photos[0].value,
          socialId: profile.id,
          provider,
        });
        await user.save();
      }
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  };
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID ,
    clientSecret: process.env.OOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
  }, (token, tokenSecret, profile, done) => {
    handleOAuth(profile, 'google', done);
  }));

// Serialize user instance to the session
passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // Deserialize user instance from the session
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });