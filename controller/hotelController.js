const Hotel = require("../models/hotelModel");
const factory = require("./handlerFactory");

exports.createHotel = factory.createOne(Hotel);
