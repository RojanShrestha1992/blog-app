const Post = require("../models/Post");
const imagekit = require("../utils/ImageKit");

// @desc Create a new post
// @route POST /api/posts
// @access Private

const createPost = async (req, res) => {
    try{
  const { title, content, tags, mediaUrl: clientMediaUrl } = req.body;



  if (!title || !content) {
    return res.status(400).json({ message: "Please add all fields" });
  }


  let finalMediaUrl = "";
  let parsedTags = [];

  if (Array.isArray(tags)) {
    parsedTags = tags;
  } else if (typeof tags === "string" && tags.trim()) {
    try {
      const jsonTags = JSON.parse(tags);
      parsedTags = Array.isArray(jsonTags)
        ? jsonTags
        : tags.split(" ").filter((tag) => tag.trim() !== "");
    } catch {
      parsedTags = tags.split(" ").filter((tag) => tag.trim() !== "");
    }
  }

  //if file exists ,upload to imagekit and get url
  if(req.file){
    const uploadedFile = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname
    })
    finalMediaUrl = uploadedFile.url;
  } else if (clientMediaUrl) {
    finalMediaUrl = clientMediaUrl;
  }


  const post = await Post.create({
    title,
    content,
    author: req.user._id, //from jwt middleware
    tags: parsedTags,
    media: finalMediaUrl
  });

  res.status(201).json(post);
}   catch(err){
    console.error("Failed to create post", err);
    res.status(500).json({message: "Server error"})
  }
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
    //delete from imagekit if media exists
    if(post.media){
        const fileId = post.media.split('/').pop().split('.')[0]; // extract fileId from url
        await imagekit.deleteFile(fileId);
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