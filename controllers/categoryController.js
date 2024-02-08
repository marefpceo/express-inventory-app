const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');
const { DateTime } = require('luxon');
const { body, validationResult } = require('express-validator');


exports.index = asyncHandler(async (req, res, next) => {
  // Get list of Categories, number of total items, and number of items per category
  const [
    allCategories,
    allItems,
  ] = await Promise.all([
    Category.find().sort({ name: 1 }).exec(),
    Item.find().populate('category').exec(),
  ]);

  const currentDate = DateTime.now().toLocaleString(DateTime.DATETIME_FULL);

  res.render('index', {
    title: 'Grocery Inventory App',
    categories: allCategories,
    items: allItems,
    current_date_time: currentDate,
  });
});


// Displays list of all Categories
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();

  res.render('category_list', {
    title: 'Category List',
    category_list: allCategories,
  });
});


// Display detail page for a specific Category
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, 'name brand number_in_stock low_limit').sort({ name: 1 }).exec(),
  ]); 

  res.render('category_detail', {
    title: `${category.name} Items`,
    category: category,
    category_items: itemsInCategory,
  });
});


// Display Category create form on GET
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render('category_form', {
    title: 'Create Category',
  });
});


// Handle Category create on POST
exports.category_create_post = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Category must be at least 3 characters')
    .escape(),
  body('cat_description')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Description must be at least 3 characters')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      cat_description: req.body.cat_description,
    });

  if (!errors.isEmpty()) {
    res.render('category_form', {
      title: 'Create Category',
      category: category,
      errors: errors.array(),
    });
    return;
  } else {
    await category.save();
    res.redirect(category.url);
  }
}),
];


// Display Category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category update GET');
});


// Handle Category update form on POST
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category update POST');
});


// Display Category delete form on GET
exports.cateogry_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category delete GET');
});


// Handle Category delete on POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category delete POST');
});