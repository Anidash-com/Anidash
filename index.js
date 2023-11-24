const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const loginRouter = require('./users/login');
const logoutRouter = require('./users/logout');
const registerRouter = require('./users/register');
const adminRouter = require('./adminRouter');
const pagenotfoundRouter = require('./404');
const profileRouter = require('./profile');
const animeRouter = require('./anime')

const app = express();
const PORT = process.env.PORT || 5000;

app
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(bodyParser.urlencoded({ extended: true }))
  .use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
  }))
  .use('/', loginRouter)  
  .use('/', logoutRouter)
  .use('/', registerRouter)
  .use('/', adminRouter)
  .use('/', pagenotfoundRouter)
  .use('/', profileRouter)
  .use('/', animeRouter)
  .get('/', async (req, res) => {

    const isLoggedIn = req.session.userId;
  const username = isLoggedIn ? req.session.username : ''; 
  res.render('landingpage', { isLoggedIn, username });

  })
  .get('/dashboard', (req, res) => {

    if (req.session.userId) {
      res.redirect('/');
      /* res.send(`Willkommen auf dem Dashboard, Benutzer ${req.session.username}!`); */
    } else {
      res.redirect('/login');
    }
  })
  .use((req, res, next) => {
    res.status(404).redirect('/404');
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
