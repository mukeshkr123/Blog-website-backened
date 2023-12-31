const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// storage
const multerStorage = multer.memoryStorage();

// file type checking
const multerFilter = (req, file, cb) => {
  // check the file type
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    //rejected file
    cb({ message: "Unsupported file format" }, false);
  }
};

const PhotoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

// image resizing
const profilePhotoResize = async (req, res, next) => {
  // check if there is no file
  if (!req.file) return next();

  req.file.filename = `user-${Date.now()}-${req.file.originalname}`; // setting the filename
  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));
  next();
};

// post image resizing
const PostImgPhotoResize = async (req, res, next) => {
  // check if there is no file
  if (!req.file) return next();

  req.file.filename = `user-${Date.now()}-${req.file.originalname}`; // setting the filename
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/posts/${req.file.filename}`));
  next();
};

module.exports = {
  PhotoUpload,
  profilePhotoResize,
  PostImgPhotoResize,
};
