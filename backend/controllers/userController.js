const User = require("../models/userModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// [POST] Register User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id",
      url: "profilePictureUrl",
    },
  });
  sendToken(user, 201, res);
});

// [POST] Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Checking if user has given password and email both
  if (!email || !password) {
    return next(new ErrorHander("Vui lòng nhập Email và Mật Khẩu", 400));
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

// [GET] Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out success",
  });
});

// [POST] Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  // Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHander(error.message, 500));
  }
});

// [PUT] Reset Passowrd
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHander(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHander("Mật khẩu không khớp", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// [GET] Get User Details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// [PUT] Update/Change User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Mật khẩu không đúng", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHander("Mật khẩu không khớp", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// [PUT] Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

// [GET] Get All User -- Admin
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    success: true,
    user,
  });
});

// [GET] Get Single User -- Admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHander(`Người dùng không tồn tại ${req.params.id}}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// [PUT] Update User Role -- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

// [DELETE] Delete User -- Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = User.findById(req.params.id);

  if (!user) {
    return next(
      ErrorHander(`Không tìm thấy tên người dùng ${req.params.id}`, 404)
    );
  }

  await User.deleteOne({ _id: req.params.id }).then(() => {
    res.status(200).json({
      success: true,
      message: "Người dùng đã được xóa",
    });
  });
});
