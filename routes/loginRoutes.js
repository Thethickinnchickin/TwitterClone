const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

const app = express();

app.set("view engine", "pug");
app.set("views", "views")


router.get("/", (req, res, next) => {
    res.status(200).render("login");
});

router.post("/", async (req, res) => {

    var payload = req.body;
    
    if (req.body.username && req.body.password) {
        let foundUser = await User.findOne({ $or: [{username: req.body.username},{email: req.body.username}]})
        .catch((err) => {
            console.log(err);
            payload.errorMessage = err;
            res.render("login")
        })

        if (foundUser != null) {
            var result = await bcrypt.compare(req.body.password, foundUser.password);

            if(result == true) {
                req.session.user = foundUser;
                return res.redirect("/");
            } 
        }
        payload.errorMessage = "Incorrect Login Info please try again"
        return res.status(200).render("login", payload);

    }
    payload.errorMessage = "Enter information to login"
    res.status(200).render("login", payload);
})

module.exports = router;