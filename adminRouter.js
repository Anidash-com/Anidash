const express = require('express');
const { getRoleByUsername, getUsers } = require('./userUtils');
const admin = require('./admin/admin');
const { getAnimes } = require('./animeUtils');

const router = express.Router();

router.use('/admin', admin);

router.get('/admin', async (req, res) =>{
    try{

    const role = await getRoleByUsername(req.session.username);
    if(role == "admin"){
        res.render("admin/adminPanel");
    } else {
        res.redirect("/404");
    }
    } catch (error) {
        console.log(error);
    }

});

router.get('/admin/addanime', async (req, res) => {

    try{

        const role = await getRoleByUsername(req.session.username);
        if(role == "admin"){
            res.render("admin/addanime");
        } else {
            res.redirect("/404");
        }
        } catch (error) {
            console.log(error);
        }

})

router.get('/admin/animes', async (req, res) => {

    try{
        const animes = await getAnimes();
        const role = await getRoleByUsername(req.session.username);
        if(role == "admin"){
            res.render("admin/animes", { animes: animes });
        } else {
            res.redirect("/404");
        }
        } catch (error) {
            console.log(error);
        }

})

router.get('/admin/users', async (req, res) => {

    try{
        const users = await getUsers();
        const role = await getRoleByUsername(req.session.username);
        if(role == "admin"){
            res.render("admin/users", { users: users });
        } else {
            res.redirect("/404");
        }
        } catch (error) {
            console.log(error);
        }

})


module.exports = router;
