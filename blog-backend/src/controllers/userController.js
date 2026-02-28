const User = require('../models/User');
const Post = require('../models/Post');
// const imagekit = require('../utils/imagekit');
const imagekit = require("../utils/imagekit");

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

const updateAvatar = async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: "Not authorized" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Please upload an image file" });
        }

        const uploadedFile = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
        });

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.avatar = uploadedFile.url;
        await user.save();

        res.json({
            message: "Profile picture updated",
            avatar: user.avatar,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
            },
        });
    } catch (err) {
        console.error("Failed to update profile picture", err);
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    getUserProfile,
    updateAvatar
}