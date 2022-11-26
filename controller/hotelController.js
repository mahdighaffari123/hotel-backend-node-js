const multer = require("multer");
const sharp = require("sharp");
const factory = require("../controller/handlerFactory");
const Hotel = require("../models/hotelModel");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.setHotelUserIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.catType) req.body.catType = "HotelReview";
  console.log(req.body);
  next();
};

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new appError("Not an image, Please upload only images", 400));
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadHotelImages = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

exports.resizeHotelImages = catchAsync(async (req, res, next) => {
  if (!req.files.coverImage || !req.files.images)
    next(new appError("coverImage or images for hotels are empty"));

  // Cover Image
  req.body.coverImage = `hotel-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.coverImage[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/hotels/${req.body.coverImage}`);

  // Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `hotel-${req.params.id}-${Date.now()}-${i + 1}`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/hotels/${filename}`);

      req.body.images.push(filename);
    })
  );
  next();
});

exports.getAllHotels = factory.getAll(Hotel);

exports.getHotel = factory.getOne(Hotel, { path: "reviews" });

exports.createHotel = factory.createOne(Hotel);

exports.updateHotel = factory.updateOne(Hotel);

exports.deleteHotel = factory.deleteOne(Hotel);
