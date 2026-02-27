const User = require('../models/User');
const Post = require('../models/Post');

const getUserProfile = async (req, res) => {
    try{
        const user = await User.findById(req.params.id).select("-password");
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        const posts = await Post.find({ author: user._id })
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        const totalUpvotes = posts.reduce((sum, post) => sum + (post.upvotes ? post.upvotes.length : 0), 0);

        res.json({
            user,
            posts,
            stats: {
                totalPosts: posts.length,
                totalUpvotes
            }
        })
    }catch(err){
        console.error("Failed to fetch user profile", err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    getUserProfile
}