const express = require('express');
const router = express.Router();

router.get('/logout', (req, res) => {

 if(req.session.userId) {
    req.session.destroy((err)=> {
    if(err){
        console.log(err)
    }
   res.redirect('/')
   });
 } else {
    res.redirect('/')
}


});
 

module.exports = router;