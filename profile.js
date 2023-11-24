const express = require('express');
const { getUserByUsername, comparePassword } = require('./userUtils');
const path = require('path');

const multer = require('multer');


let filename;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/userimgs')
    },
    filename: (req, file, cb) => {

        cb(null, filename + ".jpg")
    }
})

const upload = multer({ storage: storage})

const router = express.Router();

router.get('/profile', async (req, res) => {




    if(req.session.userId) {
        const user = await getUserByUsername(req.session.username);
        filename = user.id;
        res.render('profile', { filename, user: user});
    } else {
        res.redirect("404");
    }



});

router.post('/addprofilepicture', upload.single('image'), (req, res) => {
    res.redirect("/profile");
})

module.exports = router;
