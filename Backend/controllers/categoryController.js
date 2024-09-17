const asyncHandler = require("express-async-handler");
const Category = require("../model/Category");
const Transaction = require("../model/Transaction"); // Import the Transaction model

const categoryController = {
  //! add
  create: asyncHandler(async (req, res) => {
    const { name, type } = req.body;
    if (!name || !type) {
      throw new Error("Name and type are required for creating a category");
    }
    //Convert the name to lowercase
    const normalizedName = name.toLowerCase();
    //check if the type is valid
    const validTypes = ["income", "expense"];
    if (!validTypes.includes(type.toLowerCase())) {
      throw new Error("Invalid Category type" + type);
    }
    //! Check if alerady exists on the user
    const categoryExists = await Category.findOne({
      name: normalizedName,
      user: req.user,
    });
    if (categoryExists) {
      throw new Error(`Category ${categoryExists.name} already exists`);
    }

    //!create category
    const category = await Category.create({
      name: normalizedName,
      user: req.user,
      type,
    });
    res.status(201).json(category);
  }),

  //! Lists
  lists: asyncHandler(async (req, res) => {
    // Get the user data
    const categories = await Category.find({ user: req.user });
    res.status(200).json(categories);
  }),

  //! Update
  update: asyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const { type, name } = req.body;
    const noramalizedName = name.toLowerCase();
    const category = await Category.findById(categoryId);
    if (!category && category.user.toString() !== req.user.toString()) {
      throw new Error("Category not found or unauthorized User");
    }
    const oldName = category.name;
    //!update properties of category
    category.name = name;
    category.type = type;
    const updatedCategory = await category.save();
    //update affected txn
    if (oldName !== updatedCategory.name) {
      await Transaction.updateMany(
        {
          user: req.user,
          category: oldName,
        },
        {
          $set: { category: updatedCategory.name },
        }
      );
    }
    res.json(updatedCategory);
  }),
  //!Delete
  delete: asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category && category.user.toString() === req.user.toString()) {
      const defaultCategory = "Uncategorized";
      await Transaction.updateMany(
        {
          user: req.user,
          category: category._id,
        },
        {
          $set: { category: defaultCategory },
        }
      );
      //!Remove cateogory
      await Category.findByIdAndDelete(req.params.id);
      res.json({ message: "Category remove and transaction Updated" });
    } else {
      res.json({ message: "user unauthorized" });
    }
  }),
};

module.exports = categoryController;
