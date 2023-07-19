const expressAsyncHandler = require("express-async-handler");
const Filter = require("bad-words");
const Post = require("../../model/post/Post");
const validateMongoId = require("../../utils/validateMongodbID");
const User = require("../../model/user/User");
const cloudinaryUploadImg = require("../../utils/cloudinary");
const fs = require("fs");

// Create post
const createPostCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { user, title, description } = req.body;
  // validateMongoId(user);
  // Check for bad words
  const filter = new Filter();
  const isProfane = filter.isProfane(title) || filter.isProfane(description);

  if (isProfane) {
    await User.findOneAndUpdate({ _id }, { isBlocked: true });
    throw new Error(
      "Creating Failed because it contains bad words and you have been blocked."
    );
  }

  // 1. Get the path to the image
  const localPath = `public/images/posts/${req.file.filename}`;

  // 2. Upload to Cloudinary
  const imgUploaded = await cloudinaryUploadImg(localPath);

  try {
    const post = await Post.create({
      ...req.body,
      image: imgUploaded?.url,
      user: _id,
    });
    res.json(post);
    //Removed uploaded image after uploading
    fs.unlinkSync(localPath);
  } catch (error) {
    res.json(error);
  }
});

// fetch all posts
const fetchAllPostsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const posts = await Post.find({}).populate("user");
    res.json(posts);
  } catch (error) {
    res.json(error);
  }
});

//fetch single posts
const fetchPostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const post = await Post.findById(id).populate("user");
    // update number of views
    await Post.findByIdAndUpdate(
      id,
      { $inc: { numViews: 1 } },
      {
        new: true,
      }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

//delete a post
const deletePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    await Post.findByIdAndDelete(id);
    res.json("Deleted successfully");
  } catch (error) {
    res.json(error);
  }
});

// update the posts
const updatePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoId(id);
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      {
        new: true,
      }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createPostCtrl,
  fetchPostCtrl,
  fetchAllPostsCtrl,
  deletePostCtrl,
  updatePostCtrl,
};
