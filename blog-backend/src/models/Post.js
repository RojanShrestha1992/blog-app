const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Please add a title"]
    },
    content: {
        type: String,
        required: [true, "Please add content"]
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags:{
        type: [String],
        default: []
    }
}, {
    timestamps: true
})

const Post = mongoose.model("Post", postSchema)
module.exports = Post