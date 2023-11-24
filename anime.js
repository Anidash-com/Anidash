const express = require('express');
const { getAnimes, getAnimeById } = require('./animeUtils');
const { getCommentsByAnimeId, createRating, getRatingById, deleteRating } = require('./ratingUtils');
const { getUserById } = require('./userUtils');

const router = express.Router();

router.get('/animes', async (req, res) => {
    start();
    try {
        const animes = await getAnimes();
  
        const isLoggedIn = req.session.userId;
        const username = isLoggedIn ? req.session.username : '';

  
        res.render('index', { isLoggedIn, username, animes: animes });
    } catch (error) {
        console.error('Fehler beim Laden der Seite:', error);
        res.status(500).send('Interner Serverfehler');
    }


});


async function start(){ 

    const animes = await getAnimes();

    animes.forEach(anime => {
        router.get('/animes/' + anime.id, async (req, res) => {
            const comments = await getCommentsByAnimeId(anime.id);
            const a = await getAnimeById(anime.id);
            const isLoggedIn = req.session.userId;
            const user = await getUserById(req.session.userId);
            const userrole = isLoggedIn ? user.role : "";
            const userid = isLoggedIn ? user.id : undefined;
            res.render('anime', { anime: a, comments: comments, isLoggedIn, userrole, userid });
    
        });
    });
}


router.post('/sendrating', (req, res) => {

    const isLoggedIn = req.session.userId;
    if(isLoggedIn){

        var count = 1;
        const { text, star1, star2, star3, star4, star5 } = req.body;
    
        if (star1 != undefined) {
            count = star1;
        }
        if (star2 != undefined) {
            count = star2;
        }
        if (star3 != undefined) {
            count = star4;
        }
        if (star5 != undefined) {
            count = star5;
        }

        const username = req.session.username;
        let parts = req.url.split('?');
        let animeid = parts[1];
        res.redirect('/animes');
        createRating(animeid, isLoggedIn, username, count, text);
    }  
    res.redirect('/404');
  });


  router.post('/deleterating', async (req, res) => {

        let parts = req.url.split('?');
        let animeid = parts[1];
        const user = await getUserById(req.session.userId);
        const rating = await getRatingById(animeid)

        if (user.id == rating.user_id || user.role == "admin") {
            deleteRating(animeid);
            res.redirect('/animes');
        } else {
            res.redirect('/404');
        }
              

  });



module.exports = router;
