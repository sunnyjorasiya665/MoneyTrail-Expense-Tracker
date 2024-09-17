const express = require("express");
const usersController = require("../controllers/usersController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const userRouter = express.Router();

//!Register Route
userRouter.post("/api/v1/users/register", usersController.register);

//!Login Route
userRouter.post("/api/v1/users/login", isAuthenticated, usersController.login);

//!Profile Route
userRouter.get(
  "/api/v1/users/profile",
  isAuthenticated,
  usersController.profile
);

//!change password

userRouter.put(
  "/api/v1/users/change-password",
  isAuthenticated,
  usersController.changeUserPassword
);

//! update profile
userRouter.put(
  "/api/v1/users/update-profile",
  isAuthenticated,
  usersController.updateUserProfile
);

module.exports = userRouter;
