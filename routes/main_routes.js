/*
AUTHOR: Devin Davis
DATE: July 24th, 2021
FILE: comment_routes.js
*/

// DEPENDENCIES
import express from 'express';


// MIDDLEWARE
import isLoggedIn from '../middleware/is_logged_in.js';

// CATEGORY ROUTES
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', {
    userAuthenticated: req.isAuthenticated(),
    userEmail: req?.user?.email || '',
  });
});

router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/contact', (req, res) => {
  res.render('contact', {});
});

router.get('/settings', isLoggedIn, (req, res) => {
  res.render('settings');
});

export default router;
