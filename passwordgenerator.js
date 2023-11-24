const bcrypt = require('bcrypt');

const password = 'admin';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Fehler beim Hashen des Passworts:', err);
  } else {
    console.log('Passwort:', password);
    console.log('Hash:', hash);
  }
});