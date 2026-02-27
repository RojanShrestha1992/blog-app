const Comment = require('../models/Comment');

const createComment = async (req, res)=> {
    try{
        const {postId, text} = req.body;

        if(!text){
            return res.status(400).json({
                message: "Please add comment text"
             })
            }


        const comment = await Comment.create({
            post: postId,
            user: req.user._id,
            text
         })
        const populatedComment = await Comment.findById(comment._id).populate('user', 'name email avatar');
        res.status(201).json(populatedComment)
    } catch (error) {
        res.status(500).json({message: error.message})
    }



}


// get comments for a post
const getCommentsByPostId = async (req, res) => {
    try{
        const comments = await Comment.find({post: req.params.postId}).populate('user', 'name email avatar').sort({createdAt: -1});
        res.json(comments)
    }catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {
    createComment,
    getCommentsByPostId
}