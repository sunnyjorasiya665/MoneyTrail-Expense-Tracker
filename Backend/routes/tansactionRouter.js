const express = require("express");
const usersController = require("../controllers/usersController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const categoryController = require("../controllers/categoryController");
const transactionController = require("../controllers/transactionController");
const Transaction = require("../model/Transaction");
const transactionRouter = express.Router();

//!add
transactionRouter.post(
  "/api/v1/transactions/create",
  isAuthenticated,
  transactionController.create
);

//!lists
transactionRouter.get(
  "/api/v1/transactions/lists",
  isAuthenticated,
  transactionController.getFilteredTransactions
);
//!update
transactionRouter.put(
  "/api/v1/transactions/update-transaction/:id",
  isAuthenticated,
  transactionController.update
);
//!delete
transactionRouter.delete(
  "/api/v1/transactions/delete/:id",
  isAuthenticated,
  transactionController.delete
);

module.exports = transactionRouter;
