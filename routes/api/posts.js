const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../models/user');
const Post = require('../../models/post');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));


//Getting all posts

router.get("/", async (req, res, next) => {
     Post.find().populate('postedBy')
     .sort({"createdAt": -1})
     .then(posts => {
        res.status(200).send(posts);
     })
     .catch(err => {
        console.log(err);
        res.sendStatus(400);
     }) 
});

//Gertting all posts from One User

router.get("/:id", (req, res, next) => {
    let foundUser
});

//Creating New Post

router.post("/", async (req, res) => {
    if(!req.body.content) {
        console.log("Content params not sent with request");
        return res.sendStatus(400);
    }

    var postData = {
        content: req.body.content,
        postedBy: req.session.user,
        pinned: false
    }

    Post.create(postData)
    .then(async (newPost) => {
        let user = await User.findOneAndUpdate({_id: req.session.user},
            {$push: {posts: newPost._id}});
        await user.save();      

        newPost = await User.populate(newPost, { path: "postedBy"});
        console.log(newPost);
        res.status(201).send(newPost);
    })
    .catch((err) => {
        console.log(err);
        res.status(400);
    })
});

//

router.put("/", async (req, res, next) => {
    res.status(200).send("Fuck Me");
});

router.put("/:id/like", async (req, res, next) => {
    var postId = req.params.id;
    var userId = req.session.user._id;

    var isLiked = req.session.user.likes && req.session.user.likes.includes(postId);

    var option = isLiked ? "$pull" : "$addToSet";

    req.session.user = await User.findByIdAndUpdate(userId, { [option]: { likes: postId }}, {new: true})
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    });

    var post = await Post.findByIdAndUpdate(postId, { [option]: { likedBy: userId }}, {new: true})
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })

    res.status(200).send(post);
});



module.exports = router;