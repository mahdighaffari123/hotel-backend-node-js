const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const appError = require("../utils/appError");
const { promisify } = require("util");
const sendEmail = require("../utils/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    f_name: req.body.f_name,
    l_name: req.body.l_name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { password, email } = req.body;
  // Check if email and password are exist
  if (!email || !password)
    next(new appError("Please Provide email and password", 400));

  // Check if user is exist and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password)))
    next(new appError("Incorrect Email or Password", 401));

  // If everything is okay, send token to client
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and check if it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];

  if (!token)
    next(
      new appError("You are not logged in, please login to get access", 401)
    );

  // Verification of token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user is still exist
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    next(new appError("the user belonging to this user is no longer exist"));

  // Check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat))
    next(
      new appError("User recently changed the password, Please login again")
    );

  // Grant access to protected  route
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      next(new appError("You don't have permission to perform this action"));

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on email on req.body
  const user = await User.findOne({ email: req.body.email });
  if (!user) next(new appError("there is no user with that email address"));

  // Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send resetToken to user email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? set your new password with it's confirmation password at: ${resetUrl}`;
  console.log(message);
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save({ validateBeforeSave: false });
    next(
      new appError(
        "there was an error sending the email, try again later!",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // If token isn't expired, and there is user, set the new password
  if (!user) {
    return next(new appError("Token is invalid or expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // Change the passwordChangedAt field in database
  // it has been done in schema.pre('save') function in userModal

  // Log the user in, send JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // Check if posted password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password)))
    next(new appError("Your current password is wrong!", 401));

  // Log user in, send JWT
  createSendToken(user, 200, res);
});
