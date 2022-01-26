const express = require('express');
const Middlewear = require('./middlewear');
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
const DataBase = require('./database');
const session = require('express-session');




const app = express();


//Creating session

app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: false
}));

//connecting to database


app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "pug");
app.set("views", "views")

router.post("/", Middlewear.requireLogin, (req, res) => {
    console.log(req.body);
    res.status(200).render("home");
})

//Setting Static Files
app.use(express.static(path.join(__dirname,"public")));


//Home Page
router.get("/", (req, res) => {
    res.render("home");
})

//Api Routes
const postApiRoute = require('./routes/api/posts');

//Routes 
const loginRoutes = require('./routes/loginRoutes');
const registerRoutes = require('./routes/registerRoutes');
const mainRoutes = require('./routes/mainRoutes');
const logoutRoutes = require('./routes/logoutRoutes');


app.use('/login', loginRoutes);
app.use('/logout', logoutRoutes);
app.use('/register', registerRoutes);
app.use('', mainRoutes);
app.use('/api/posts', postApiRoute);



app.listen(3000, () => {
    console.log("Server running on port 3000");
})


