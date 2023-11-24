const express = require('express');
const { createUser, getUserByUsername, getUserByEmail, setPasswordForUser } = require('./../userUtils');

const router = express.Router();

router.get('/register', (req, res) => res.render('register'));

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {

    const existingUserByUsername = await getUserByUsername(username);
    const existingUserByEmail = await getUserByEmail(email);

    if (existingUserByUsername) {
      return res.send('Benutzername bereits vergeben');
    }

    if (existingUserByEmail) {
      return res.send('E-Mail-Adresse bereits registriert');
    }


    const newUser = {
      username: username,
      email: email,
      password: password,
      
    };


    const createdUser = await createUser(newUser);

    if (createdUser) {
      res.redirect('/login'); 
    } else {
      res.send('Fehler bei der Registrierung');
    }
  } catch (error) {
    console.error('Fehler bei der Registrierung:', error);
    res.status(500).send('Interner Serverfehler');
  }
});

module.exports = router;
