const APIFeatures = require("../utils/apiFeatures");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAll = (model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested get reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // 2) EXECUTE QUERY
    const features = new APIFeatures(model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    // const docs = await features.query.explain();
    const docs = await features.query;

    // 3) SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs,
    });
  });

exports.getOne = (model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) next(new appError("No document found with this ID"), 404);

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.createOne = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.create(req.body);
    res.status(201).json({
      status: "success",
      data: doc,
    });
  });
