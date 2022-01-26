const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const UserSchema = new Schema({
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    username: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true},
    password: {type: String, required: true, trim: true},
    profilePic: {type: String, default:"/images/twittercloneEgg.jpg"},
    posts: [{type: Schema.Types.ObjectId, ref: "Post"}],
    likes: [{type: Schema.Types.ObjectId, ref: 'Post'}]
}, {timestamps: true});

module.exports = mongoose.model("User", UserSchema);