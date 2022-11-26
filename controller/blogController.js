const multer = require("multer");
const sharp = require("sharp");
const Blog = require("../models/blogModel");
const appError = require("../utils/appError");
const factory = require("./handlerFactory");

exports.setBlogUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new appError("Not an image, Please upload only images", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadBlogPhoto = upload.single("photo");

exports.resizeBlogPhoto = (req, res, next) => {
  if (!req.file)
    return next(new appError("There is no image, Please upload one"));

  req.file.filename = `blog-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(250, 150)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/blogs/${req.file.filename}`);

  next();
};

exports.getAllBlogs = factory.getAll(Blog);

exports.createBlog = factory.createOne(Blog);

exports.getBlog = factory.getOne(Blog, { path: "reviews" });

exports.updateBlog = factory.updateOne(Blog);

exports.deleteBlog = factory.deleteOne(Blog);
