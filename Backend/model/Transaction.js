const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["income", "expense"],
  },
  category: {
    type: String,
    required: true,
    default: "Uncategorized",
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // You may want to track the date of the transaction
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
