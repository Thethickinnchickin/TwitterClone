const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');


const app = express();

app.set("view engine", "pug");
app.set("views", "views")


router.get("/", (req, res) => {
    res.status(200).render('register');
});

 router.post("/", async (req, res) => {
    try {
        var firstName = req.body.firstName.trim();
        var lastName = req.body.lastName.trim();
        var username = req.body.username.trim();
        var email = req.body.email.trim();
        var password = req.body.password;
        var payload = req.body;
 

        if(firstName && lastName && username && email && password) {

            let foundUser = await User.findOne({ $or: [{username: username},{email: email}]})
            .catch((err) => {
                console.log(err);
                console.log("Something went wrong")
                res.render("register")
            })
            if(foundUser == null) {
               let data = req.body;          
               data.password = await bcrypt.hash(password, 10);

               
                User.create(data)
                .then((user) =>{
                    req.session.user = user;
                    payload = user;      
                    return res.redirect('/',200, payload);                   
                })

            } else {
 


               
                if(foundUser.email = email) {
                    payload.errorMessage = "Someone already has this email."
                }
                if(foundUser.username = username) {
                    payload.errorMessage = "Someone already has this username."
                }
                res.status(200).render("register", payload);    

                                  
            }

        } else {
            payload.errorMessage = "Make sure each field has a value";
            res.status(200).render("register", payload);
        }
    } catch (err) {
        res.status(500).render('home');
    }

});

module.exports = router;