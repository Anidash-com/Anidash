const mysql = require('mysql2/promise');
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

async function getAnimes() {
  const [rows] = await pool.query('SELECT * FROM animes');
  return rows;
}

async function addAnime(name, keywords, image, description) {
  await pool.query('INSERT INTO animes (name, keywords, image, description) VALUES (?, ?, ?, ?)', [name, keywords, image, description]);
}

async function deleteAnime(id) {
  await pool.query('DELETE FROM animes WHERE id = ?', [id]);
}

async function getAnimeById(id) {
  const [rows] = await pool.query('SELECT * FROM animes WHERE id = ?', [id]);
  return rows[0]; 
}

module.exports = { getAnimes, addAnime, deleteAnime, getAnimeById };

//Sql Command --> 

/*
CREATE TABLE animes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  keywords VARCHAR(255) NOT NULL,
  image VARCHAR(2550) NOT NULL,
  description VARCHAR(255) NOT NULL
);
*/
