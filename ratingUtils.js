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

async function createRating(animeId, userId, username, rating, comment) {
  const [existingRatings] = await pool.query('SELECT * FROM ratings WHERE anime_id = ? AND user_id = ?', [animeId, userId]);

  if (existingRatings.length > 0) {
    return null;
  }

  await pool.query('INSERT INTO ratings (anime_id, user_id, username, points, comment) VALUES (?, ?, ?, ?, ?)', [animeId, userId, username, rating, comment]);

  const [newRating] = await pool.query('SELECT * FROM ratings WHERE anime_id = ? AND user_id = ?', [animeId, userId]);
  return newRating[0];
}
  
  async function deleteRating(commentId) {
    const [result] = await pool.query('DELETE FROM ratings WHERE rating_id = ?', [commentId]);
    
    if (result.affectedRows > 0) {
      return true; 
    } else {
      return false; 
    }
  }


  async function getCommentsByAnimeId(animeId) {
    const [comments] = await pool.query('SELECT * FROM ratings WHERE anime_id = ?', [animeId]);
    return comments;
  }

  async function getRatingById(ratingId) {
    const [rows] = await pool.query('SELECT * FROM ratings WHERE rating_id = ?', [ratingId]);
    return rows[0];
  }
  
  module.exports = {
    createRating,
    deleteRating,
    getCommentsByAnimeId,
    getRatingById
  };

//Sql Command --> 

/*
CREATE TABLE ratings (
  rating_id INT AUTO_INCREMENT PRIMARY KEY,
  anime_id INT NOT NULL,
  user_id INT NOT NULL,
  username VARCHAR(255) NOT NULL,
  points INT NOT NULL,
  comment TEXT
);

*/
