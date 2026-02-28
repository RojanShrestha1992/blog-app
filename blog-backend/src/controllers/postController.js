const Post = require("../models/Post");
const imagekit = require("../utils/imagekit");

// @desc Create a new post
// @route POST /api/posts
// @access Private

const createPost = async (req, res) => {
  try {
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
    if (req.file) {
      const uploadedFile = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
      });
      finalMediaUrl = uploadedFile.url;
    } else if (clientMediaUrl) {
      finalMediaUrl = clientMediaUrl;
    }

    const post = await Post.create({
      title,
      content,
      author: req.user._id, //from jwt middleware
      tags: parsedTags,
      media: finalMediaUrl,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("Failed to create post", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getPosts = async (req, res) => {
  const posts = await Post.find()
    .populate("author", "name email avatar")
    .sort({ createdAt: -1 });
  res.json(posts);
};

const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate(
    "author",
    "name email avatar",
  );
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    let parsedTags = post.tags || [];
    if (Array.isArray(req.body.tags)) {
      parsedTags = req.body.tags;
    } else if (typeof req.body.tags === "string") {
      const incomingTags = req.body.tags.trim();
      if (incomingTags) {
        try {
          const jsonTags = JSON.parse(incomingTags);
          parsedTags = Array.isArray(jsonTags)
            ? jsonTags
            : incomingTags.split(" ").filter((tag) => tag.trim() !== "");
        } catch {
          parsedTags = incomingTags
            .split(" ")
            .filter((tag) => tag.trim() !== "");
        }
      } else {
        parsedTags = [];
      }
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.tags = parsedTags;

    if (req.file) {
      const uploadedFile = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
      });
      post.media = uploadedFile.url;
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    console.error("Failed to update post", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (post.media) {
      try {
        const fileId = post.media.split("/").pop().split(".")[0];
        await imagekit.deleteFile(fileId);
      } catch (imagekitErr) {
        console.warn("ImageKit delete skipped/failed:", imagekitErr.message);
      }
    }

    await post.deleteOne();
    res.json({ message: "Post removed" });
  } catch (err) {
    console.error("Failed to delete post", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @route PUT /api/posts/:id/upvote

const toggleUpvote = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user._id;

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const alreadyUpvoted = post.upvotes.some(
      (id) => id.toString() === userId.toString(),
    );

    if (alreadyUpvoted) {
      post.upvotes = post.upvotes.filter(
        (id) => id.toString() !== userId.toString(),
      );
    } else {
      post.upvotes.push(userId);
    }
    await post.save();
    res.json({ upvotes: post.upvotes, upvoted: !alreadyUpvoted });
  } catch (err) {
    console.error("Failed to toggle upvote", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  toggleUpvote,
};
