const Post = require("../models/Post");

const createPost = async (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Please add all fields" });
  }

  const post = await Post.create({
    title,
    content,
    author: req.user._id, //from jwt middleware
    tags,
  });

  res.status(201).json(post);
};

const getPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("author", "name email")
    .sort({ createdAt: -1 });
  res.json(posts);
};


const getPostById = async (req, res) => {
    const post = await Post.findById(req.params.id).populate("author", "name email");
    if(!post){
        return res.status(404).json({message: "Post not found"})
    }
    res.json(post);
}


const updatePost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if(!post){
        return res.status(404).json({message: "Post not found"})
    }
    // check if current user is the author of the post
    if(post.author.toString() !== req.user._id.toString()){
        return res.status(401).json({message: "Not authorized"})
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.tags = req.body.tags || post.tags;

    const updatedPost = await post.save();
    res.json(updatedPost);
}

const deletePost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if(!post){
        return res.status(404).json({message: "Post not found"})
    }
    //check if current user is the author of the post
    if(post.author.toString() !== req.user._id.toString()){
        return res.status(401).json({message: "Not authorized"})
    }
    await post.deleteOne({id: req.params.id});
    res.json({message: "Post removed"})
}

module.exports = {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost
}