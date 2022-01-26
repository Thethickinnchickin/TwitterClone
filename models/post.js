const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    content: {type: String, trim: true, required: true},
    postedBy: {type: Schema.Types.ObjectId,ref: "User"},
    pinned: Boolean,
    likedBy: [{type: Schema.Types.ObjectId, ref: "User"}]
}, {timestamps: true});

module.exports = mongoose.model('Post', PostSchema);