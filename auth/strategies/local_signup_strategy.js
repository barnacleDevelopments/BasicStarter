import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';

// MODELS
import User from '../../models/user_model.js';

export default new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
}, (req, email, password, done) => {
  User.findOne({ email }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (user) {
      return done(null, false);
    }

    // encrypt passwrod
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (saltErr, salt) => {
      bcrypt.hash(password, salt, (hashErr, hash) => {
        User.create({
          email,
          password: hash,
        }).then(user => done(null, user));
      });
    });
  });
});
