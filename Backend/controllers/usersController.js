const asyncHandler = require("express-async-handler");
const User = require("../model/User"); // Corrected: use 'User' instead of 'user'
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const usersController = {
  //! Register
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    //! Validate input
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("All fields are required");
    }

    //! Check if the user already exists
    const userExists = await User.findOne({ email }); // Corrected: 'User.findOne'
    if (userExists) {
      res.status(400);
      throw new Error("Email already exists");
    }

    //! Hash the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //! Create a new user and save it to the database
    const userCreated = await User.create({
      email,
      username,
      password: hashedPassword, // Save the hashed password
    });

    //! Send response
    res.status(201).json({
      id: userCreated._id,
      username: userCreated.username,
      email: userCreated.email,
    });
  }),

  //! Login
  login: asyncHandler(async (req, res) => {
    // Get the user data
    const { email, password } = req.body;

    //! Find the user by email
    const user = await User.findOne({ email }); // Corrected: 'User.findOne'
    if (!user) {
      res.status(401);
      throw new Error("Invalid login credentials");
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid login credentials");
    }

    // Generate a token
    const token = jwt.sign({ id: user._id }, "jorasiyaKey", {
      expiresIn: "3d",
    });

    //! Send response
    res.json({
      message: "Login Success",
      token,
      id: user._id,
      email: user.email,
      username: user.username,
    });
  }),

  //! Profile

  profile: asyncHandler(async (req, res) => {
    //Get the user Data
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("No Data Found");
    }

    //? send the response
    res.json({
      username: user.username,
      email: user.email,
    });
  }),

  //! Change password
  changeUserPassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    //Fing the user Data
    const user = await User.findById(req.user);

    if (!user) {
      throw new Error("No Data Found");
    }
    //! Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    //! Resave
    await user.save({
      validateBeforeSave: false,
    });
    //? send the response
    res.json({
      message: "Password Changed Successfully",
    });
  }),

  //! Update User Profile
  updateUserProfile: asyncHandler(async (req, res) => {
    const { email, username } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        username,
        email,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User profile updated successfully",
      updatedUser,
    });
  }),
};

module.exports = usersController;
