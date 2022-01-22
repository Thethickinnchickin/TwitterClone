const express = require('express');
const router = express.Router();
const middlewear = require('../middlewear');


router.get('/', middlewear.requireLogin, (req,res) => {
    var payload = {
        pageTitle: "Home",
        userLoggedIn: req.session.user
    }

    res.status(200).render("home", payload);
})

module.exports = router;