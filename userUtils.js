const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const config = require('./mysql.json');

const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function getUsers() {
  const [rows] = await pool.query('SELECT * FROM users');
  return rows;
}

async function getUserByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
}

async function getUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function getRoleByUsername(username) {
  const [rows] = await pool.query('SELECT role FROM users WHERE username = ?', [username]);
  return rows[0] ? rows[0].role : null;
}

async function comparePassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

async function setPasswordForUser(username, newPassword) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  await pool.query('UPDATE users SET passwordHash = ? WHERE username = ?', [hashedPassword, username]);

  const updatedUser = await getUserByUsername(username);
  return updatedUser;
}

async function setRoleForUser(username, newRole) {
  await pool.query('UPDATE users SET role = ? WHERE username = ?', [newRole, username]);

  const updatedUser = await getUserByUsername(username);
  return updatedUser;
}

async function createUser(newUser) {
  const existingUserByUsername = await getUserByUsername(newUser.username);
  const existingUserByEmail = await getUserByEmail(newUser.email);

  if (existingUserByUsername || existingUserByEmail) {
    return null; // Benutzer bereits vorhanden
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newUser.password, saltRounds);

  const [result] = await pool.query(
    'INSERT INTO users (username, email, passwordHash, role) VALUES (?, ?, ?, ?)',
    [newUser.username, newUser.email, hashedPassword, newUser.role || 'user']
  );

  if (result && result.insertId) {
    const insertedUser = await getUserByUsername(newUser.username);
    return insertedUser;
  } else {
    return null; // Fehler beim Erstellen des Benutzers
  }
}

async function deleteUserById(userId) {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);

  if (result && result.affectedRows > 0) {
    return true; // Benutzer erfolgreich gelöscht
  } else {
    return false; // Fehler beim Löschen des Benutzers oder Benutzer nicht gefunden
  }
}

async function getUserById(userId) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
  return rows[0];
}


module.exports = {
  getUsers,
  getUserByUsername,
  getUserByEmail,
  getRoleByUsername,
  comparePassword,
  setPasswordForUser,
  setRoleForUser,
  createUser,
  deleteUserById,
  getUserById
};



// Mysql Table Create command -->
/*
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  role VARCHAR(255) DEFAULT 'user'
);
*/