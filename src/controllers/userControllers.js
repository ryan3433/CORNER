const passport = require("passport");
import db from "../mysql";
import bcrypt from "bcrypt";
import shortid from "shortid";

export const getJoin = (req, res) => {
  res.render("join");
};

export const postJoin = async (req, res, next) => {
  const id = shortid.generate(); // short id 로 바꿔야함.
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const password2 = req.body.password2;

  if (password !== password2) {
    req.flash("error", "Password must same!");
    res.redirect("/join");
  } else {
    try {
      bcrypt.hash(password, 10, function(err, hashedPw) {
        if (err) {
          console.log(err);
          throw err;
        }
        db.beginTransaction(err => {
          if (err) console.log(err);
          db.query("SELECT * FROM user WHERE email=?", [email], (err, rows) => {
            if (err) {
              console.log(err);
              db.rollback(() => console.error("rollback error1"));
            }
            const user = rows[0];
            if (user) {
              db.query(
                "UPDATE user SET password=?, name=? WHERE email=?",
                [hashedPw, name, email],
                err => {
                  if (err) {
                    console.log(err);
                    db.rollback(() => console.error("rollback error2"));
                  } else {
                    db.commit(err => {
                      if (err) console.log(err);
                      next();
                    });
                  }
                }
              );
            } else {
              db.query(
                `INSERT INTO user (id, name, email, password) VALUES (?, ?, ?, ?)`,
                [id, name, email, hashedPw],
                err => {
                  if (err) {
                    console.log(err);
                    db.rollback(() => console.error("rollback error3"));
                  } else {
                    db.commit(err => {
                      if (err) console.log(err);
                      next();
                    });
                  }
                }
              );
            }
          });
        });
        //res.redirect("/"); join 후에 login 되게 수정 필요
      });
    } catch (err) {
      console.log(err);
    }
  }
};

export const getLogin = (req, res) => {
  res.render("login");
};

export const postLogin = (req, res, next) => {
  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    } else if (!user) {
      console.log("message: " + info.message);
      return res.redirect("/login");
    } else {
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        res.redirect(req.session.returnTo || "/");
        delete req.session.returnTo;
      });
    }
  })(req, res, next);
};

export const githubLogin = passport.authenticate("github");

export const googleLogin = passport.authenticate("google", {
  scope: [
    "https://www.googleapis.com/auth/plus.login",
    "https://www.googleapis.com/auth/userinfo.email"
  ]
});

export const googleLoginCallBack = (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  const {
    _json: { sub: id, picture: avatarUrl, name, email }
  } = profile;
  try {
    db.beginTransaction(err => {
      if (err) {
        console.log(err);
        throw err;
      }
      db.query("SELECT * FROM user WHERE email=?", [email], (err, rows) => {
        if (err) {
          console.log(err);
          db.rollback(() => console.error("rollback error1"));
        }
        const user = rows[0];

        if (user) {
          db.query(
            "UPDATE user SET googleId=? WHERE email=?",
            [id, email],
            err => {
              if (err) {
                console.log(err);
                db.rollback(() => console.error("rollback error2"));
              } else {
                db.commit(err => {
                  if (err) console.log(err);
                });
              }
            }
          );
          return done(null, user);
        } else {
          console.log("There is no user.");
          const userId = shortid.generate();
          db.query(
            "INSERT INTO user(id, email, name, googleId, avatarUrl) VALUES(?, ?, ?, ?, ?)",
            [userId, email, name, id, avatarUrl],
            err => {
              if (err) {
                console.log(err);
                db.rollback(() => console.error("rollback error3"));
              } else {
                db.commit(err => {
                  if (err) console.log(err);
                });
              }
            }
          );
          return done(null, user);
        }
      });
    });
  } catch (error) {
    return done(error);
  }
};

export const githubLoginCallBack = (accessToken, refreshToken, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email }
  } = profile;
  try {
    db.beginTransaction(err => {
      if (err) console.log(err);
      db.query("SELECT * FROM user WHERE email=?", [email], (err, rows) => {
        if (err) {
          console.log(err);
          db.rollback(() => console.error("rollback error1"));
        }
        const user = rows[0];

        if (user) {
          db.query(
            "UPDATE user SET githubId=? WHERE email=?",
            [id, email],
            err => {
              if (err) {
                console.log(err);
                db.rollback(() => console.error("rollback error2"));
              } else {
                db.commit(err => {
                  if (err) console.log(err);
                });
              }
            }
          );
          return cb(null, user);
        } else {
          console.log("There is no user.");
          const userId = shortid.generate();
          db.query(
            "INSERT INTO user(id, email, name, githubId, avatarUrl) VALUES(?, ?, ?, ?, ?)",
            [userId, email, name, id, avatarUrl],
            err => {
              if (err) {
                console.log(err);
                db.rollback(() => console.error("rollback error3"));
              } else {
                db.commit(err => {
                  if (err) console.log(err);
                });
              }
            }
          );
          return cb(null, user);
        }
      });
    });
  } catch (error) {
    return cb(error);
  }
};

export const logout = (req, res) => {
  req.logout();
  res.redirect(req.session.redirectTo || "/");
  delete req.session.redirectTo;
};

export const userProfile = (req, res) => {
  const profileId = req.params.id;
  db.query(
    "SELECT id, name, email, avatarUrl, subject FROM user LEFT OUTER JOIN board ON user.id=board.user_id WHERE id = ?",
    [profileId],
    (err, rows) => {
      if (err) {
        console.log(err);
      }
      res.render("profile", { rows });
    }
  );
};
