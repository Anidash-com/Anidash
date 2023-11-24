const express = require('express');
const { addAnime, deleteAnime } = require('../animeUtils');
const { deleteUserById } = require('../userUtils');

const router = express.Router();

router.post('/addanime', async (req, res) => {
  const { name, keywords, image, description} = req.body;
    addAnime(name, keywords, image, description);
    res.redirect('/admin');
});


router.post('/deleteanime', (req, res) => {

  let parts = req.url.split('?');
  let number = parts[1];
  res.redirect('/admin/animes');
  deleteAnime(number);

});

router.post('/deleteuser', (req, res) => {

  let parts = req.url.split('?');
  let number = parts[1];
  res.redirect('/admin/animes');
  deleteUserById(number);

});




module.exports = router;
