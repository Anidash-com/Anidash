const express = require('express');
const { getUserByUsername, comparePassword } = require('./../userUtils');

const router = express.Router();

router.get('/login', (req, res) => res.render('login', { notification: '' }));

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);

    if (user && await comparePassword(password, user.passwordHash)) {
      req.session.userId = user.id;
      req.session.username = username;
      res.redirect('/');
    } else {
      res.render('login', { notification: 'Anmeldeinformationen sind ungültig' });
    }
  } catch (error) {
    console.error('Fehler beim Anmelden:', error);
    res.status(500).send('Interner Serverfehler');
  }
});

module.exports = router;
