const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
  GitHubStrategy = require("passport-github").Strategy;
import db from "./mysql";
import bcrypt from "bcrypt";
import {
  googleLoginCallBack,
  githubLoginCallBack
} from "./controllers/userControllers";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GG_ID,
      clientSecret: process.env.GG_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback"
    },
    googleLoginCallBack
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      callbackURL: "http://localhost:5000/auth/github/callback"
    },
    githubLoginCallBack
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    function(username, password, done) {
      db.query(
        "SELECT email, password FROM user WHERE email=?",
        [username],
        (err, rows) => {
          var user = rows[0];

          const email = rows[0].email;
          const dbPassword = rows[0].password;
          if (err) {
            console.log(err);
          } else {
            if (username === email) {
              bcrypt.compare(password, dbPassword, (err, result) => {
                if (result) {
                  return done(null, user);
                } else {
                  return done("Incorrect password.");
                }
              });
            } else {
              return done("Incorrect username.");
            }
          }
        }
      );
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(function(email, done) {
  db.query("SELECT * FROM user WHERE email=?", [email], (err, results) => {
    if (err) {
      return done(err, false);
    }
    if (!results[0]) {
      return done(err, false);
    }

    //console.log(results);
    return done(null, results[0]);
  });
});

export default passport;
