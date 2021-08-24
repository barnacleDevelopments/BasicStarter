import express from 'express';
import passport from 'passport';
import session from 'express-session';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import MongoStore from 'connect-mongo';
import pug from 'pug';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// DB MODELS
import User from '../models/user_model.js';

// MIDDLEWARE
import addUserStatusToRenders from '../middleware/user_status_on_renders.js';

// STRATEGIES
import localStrategy from '../auth/strategies/local_strategy.js';
import localSignupStrategy from '../auth/strategies/local_signup_strategy.js';
import isLoggedIn from '../middleware/is_logged_in.js';

const router = express.Router();
dotenv.config({ path: '.env' });
// enviromental variables
const {
  PORT,
  APP_NAME,
  SMTP_PASS,
  SMTP_HOST_EMAIL,
  DB_URL_DEV,
} = process.env;

// ----- AUTHENTICATION CONFIGURATION START ------

router.use(session({
  secret: crypto.randomBytes(48).toString('hex'),
  resave: true,
  saveUninitialized: true,
  // session expires after 3 hours.
  cookie: { maxAge: 60 * 1000 * 60 * 3 },
  store: MongoStore.create({
    mongoUrl: DB_URL_DEV,
  }),
  // secure: true, // set this to true in production
}));

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use('local', localStrategy);
passport.use('local-signup', localSignupStrategy);

router.use(addUserStatusToRenders);

// ------- SETUP NODEMAILER TRANSPORTER
const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 465,
  secure: true,
  auth: {
    user: SMTP_HOST_EMAIL,
    pass: SMTP_PASS,
  },
});

// ------ AUTHENTICATION ROUTES START --------

// GET: Login view.
router.get('/login', (req, res) => {
  res.render('auth/login', {});
});

// GET: Registration view.
router.get('/register', (req, res) => {
  res.render('auth/register', {});
});

// GET: Get recovery request view.
router.get('/recovery', (req, res) => {
  res.render('auth/recovery_request_form', {});
});

// GET: Return delete password view template.
router.get('/delete-account', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next(new Error('You must first login to access this feature.'));
  }
  const component = pug.renderFile('components/dialogs/delete_account_dialog.pug', {
    userEmail: req.user.email,
  });
  res.status(200).send(component);
});

// GET: Password reset view.
router.get('/recovery/:token', (req, res) => {
  const { token } = req.params;
  // verify that payload matches user password reset token
  User.findOne({ reset_password_token: token }, (userErr, user) => {
    if (userErr) {
      res.status(500).send('A server error occured.');
    }

    if (!user) {
      res.render('auth/recovery_form', { errorMessage: 'The user was not found or your recovery link expired. Please return to password reset.' });
    } else {
      res.render('auth/recovery_form', { token });
    }
  });
});

// GET: Logout user.
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// POST: Login user.
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.render('auth/login', { errorMessage: 'The email or password you entered is incorrect.' });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(err);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

// POST: Register new user.
router.post('/register', (req, res, next) => {
  passport.authenticate('local-signup', (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.render('auth/register', { errorMessage: 'That email is already taken' });
    }

    req.logIn(user, (loginErr) => {
      if (err) {
        return next(loginErr);
      }

      return res.redirect('/');
    });

    return res.redirect('/');
  })(req, res, next);
});

// POST: Reset user password.
router.post('/recovery', (req, res) => {
  // if user is already logged in redirect to home page
  if (req.user) {
    res.redirect('/');
  }

  // find user in DB
  const userEmail = req.body.email;

  User.findOne({ email: userEmail }, (err, user) => {
    if (err) {
      res.status(500).send('A server error occured.');
    }
    // if user is not found return message stating so
    if (!user) {
      res.render('auth/recovery_request_form', { errorMessage: 'The email you provided does not have an account associate with it.' });
    } else {
      // generate unique token
      const tokenObject = {
        email: user.email,
        id: user.id,
      };

      // create unique secret
      const secret = `${user.id}_${user.email}_${new Date().getTime()}`;

      // sign token
      const token = jwt.sign(tokenObject, secret);

      // add token to user in db and set expiry date
      User.findOneAndUpdate({ _id: user.id }, {
        reset_password_token: token,
        reset_password_expires: Date.now() + 86400000,
      }, { new: true }, () => {
        // send password reset email
        transporter.sendMail({
          from: SMTP_HOST_EMAIL,
          to: userEmail,
          subject: `Password Recovery for ${APP_NAME}`,
          text: `Press the recovery link bellow to recover your password. http://localhost:${PORT}/recovery/${token} If you did not request a password recovery please login to your account and change your password.`,
        }).then(() => {
          res.render('auth/recovery_request_success');
        })
          .catch(() => {
            res.render('auth/recovery_request_form', { errorMessage: 'Failed to send email. Please try again.' });
          });
      });
    }
  });
});

// POST: Reset user password.
router.post('/resetpassword', (req, res, next) => {
  const { reapeatPassword, password } = req.body;
  if (reapeatPassword !== password) {
    res.render('auth/recovery_request_form', { errorMessage: 'Passwords do not match.' });
  }

  User.findOne({
    reset_password_expires: {
      $gt: Date.now(),
    },
    reset_password_token: req.body.token,
  }).exec((err, user) => {
    if (err) {
      res.render('auth/recovery_request_form', { errorMessage: 'A server error occured. Please refresh the page and try again.' });
      next(err);
    }

    if (!user) {
      res.render('auth/recovery_request_form', { errorMessage: 'Password reset failed. We could not find a user associate with this account.' });
    }

    // encrypt the new user password and store in db.
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, (saltErr, salt) => {
      bcrypt.hash(req.body.password, salt, (hashErr, hash) => {
        // store password as hash
        user.password = hash;

        // remove old token and expiry date
        user.reset_password_expires = null;
        user.reset_password_token = null;

        // save the updated user
        user.save((saveErr) => {
          if (saveErr) {
            res.render('auth/recovery_request_form', { errorMessage: 'Failed to update user password. Please return to password reset page.' });
          }

          // send password reset email
          transporter.sendMail({
            from: SMTP_HOST_EMAIL,
            to: user.email,
            subject: `${APP_NAME} Successfull password reset`,
            text: `We are notifying you of your recent password reset for your ${APP_NAME} account. If you did not make this change please reset your password as soon as possible.`,
          }).then(() => {
            res.render('auth/login');
          })
            .catch(() => {
              res.render('auth/login', { errorMessage: 'Password reset was successfull but failed to send confirmation email.' });
            });
        });
      });
    });
  });
});

// DELETE: Remove user from db.
router.delete('/delete-account', isLoggedIn, async (req, res) => {
  const emailsMatch = req.body.inputedEmail === req.user.email;
  const userId = req.user.id;
  if (emailsMatch) {
    req.logout();
    await User.deleteOne({ _id: userId });
    res.status(201).send('Account successfuly deleted!');
  } else {
    res.status(400).send('Emails do not match');
  }
});

// --------- AUTHENTICATON ROUTES END ---------

export default router;
