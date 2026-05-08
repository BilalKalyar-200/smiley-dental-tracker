//handles Register and Login logic
//register() -> creates new user in MongoDB, returns JWT
//login()    -> verifies credentials, returns JWT

const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      password,
      role,
      dateOfBirth,
      gender,
      phoneNumber,
      licenseNumber,
      specialization,
    } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    //create user (password is hashed automatically by the pre-save hook in User.js)
    const user = await User.create({
      fullName,
      email,
      password,
      role: role || "patient",
      dateOfBirth,
      gender: gender || undefined, 
      phoneNumber,
      licenseNumber,
      specialization,
    });

    //generate JWT token using the new user's ID
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error); //pass to errorMiddleware
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //find user ... include password because select: false in schema hides it by default
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    //use comparePassword method from User model
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged-in user's profile
// @route   GET /api/auth/me
// @access  Protected (requires token)
const getMe = async (req, res, next) => {
  try {
    // req.user is set by authMiddleware.protect
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
