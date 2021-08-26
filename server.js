/*
AUTHOR: Devin Davis
DATE: July 27th, 2021
FILE: app.js
*/

// DEPENDENCIES
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// DEV DEPENDENCIES
import pino from 'pino';
import expressPino from 'express-pino-logger';

// ROUTES
import mainRoutes from './routes/main_routes.js';
import authRoutes from './routes/auth_routes.js';
import mailRoutes from './routes/mail_routes.js';
import productRoutes from './routes/product_routes.js';
import cartRoutes from './routes/cart_routes.js'

const app = express();

// PINO LOGGER CONFIG
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const expressLogger = expressPino({ logger });

// ENVIROMENTAL VARIABLES
dotenv.config({ path: '.env' });
const {
  PORT,
  DB_URL_DEV,
} = process.env;

// CONGIGURE DB
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(DB_URL_DEV)
  .then(() => (
    logger.info('Sucessfully connected to db!')
  ))
  .catch(() => (
    logger.error('Connection error occured!')
  ));

// CROSS ORGIN REQUEST SETTINGS
app.use(cors(
  {
    origin: [`http://localhost:${PORT}`],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204,
  },
));

// APP CONFIGURATION
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// pino logger
app.use(expressLogger);
app.set('view engine', 'pug');

// SET HTTP HEADERS
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "'unsafe-eval'", "*.fontawesome.com/"],
      "script-src-elem": ["'self'", "*.fontawesome.com/"],
      "connect-src": ["'self'", "*.fontawesome.com/", "https://dev-qkxpd7xc.auth0.com/"],
      "style-src": ["'self'", "*.googleapis.com/", "'unsafe-inline'", "*.fontawesome.com/", ,],
      "font-src": ["'self'", "*.fontawesome.com/", "*.gstatic.com/"],
      "img-src": ["'self'", "data:", "'unsafe-eval'", "'unsafe-inline'"],
    },
    frameguard: "deny"
  }
}));

// ROUTES
app.use('/', authRoutes);
app.use('/', mainRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes)
app.use('/mail', mailRoutes);
app.use('*', (req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// ERROR HANDLING MIDDLEWARE
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(PORT, () => logger.info(`Listening on http://localhost:${PORT}`));