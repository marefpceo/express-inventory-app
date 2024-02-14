const SubCategory = require('../models/subCategory');
const Category = require('../models/category');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Displays list of all Categories
exports.sub_category_list = asyncHandler(async (req, res, next) => {
  const allSubcategories = await SubCategory.find().sort({ name: 1 }).exec();
  
  res.render('sub_category_list', {
    title: 'Subcategory List',
    subcategory_list: allSubcategories,
  });
});


// Display detail page for a specific Category
exports.sub_category_detail = asyncHandler(async (req, res, next) => {
  const [ subcategory, itemsInSubcategory ] = await Promise.all([
    SubCategory.findById(req.params.id).populate('category').exec(),
    Item.find({ sub_category: req.params.id }, 'name brand number_in_stock low_limit').sort({ name: 1 }).exec(),
  ]);

  if (subcategory === null) {
    const err = new Error('Subcategory not found!');
    err.status = 404;
    return next(err);
  }

  res.render('sub_category_detail', {
    title: `${subcategory.name} List`,
    subcategory: subcategory,
    subcategory_items: itemsInSubcategory,
  });
});


// Display Category create form on GET
exports.sub_category_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();

  res.render('sub_category_form', {
    title: 'Create Subcategory',
    categories: allCategories,
  });
});


// Handle Category create on POST
exports.sub_category_create_post = [
  body('subcatName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Subcategory must contain at least 3 characters')
    .escape(),
  body('categorySelect')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const [ allCategories, subcategory ] = await Promise.all([
      Category.find().sort({ name: 1 }).exec(),
      new SubCategory({
        name: req.body.subcatName,
        category: await Category.findById(req.body.categorySelect),
      }),
    ]);


  if (!errors.isEmpty()) {
    res.render('sub_category_form', {
      title: 'Create Subcategory',
      subcategory: subcategory,
      categories: allCategories,
      errors: errors.array(),
    });
    return;
    } else {
      await subcategory.save();
      res.redirect('/inventory/subcategories');
    }
  }),
];


// Display Category update form on GET
exports.sub_category_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Sub Category update GET');
});


// Handle Category update form on POST
exports.sub_category_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Sub Category update POST');
});


// Display Category delete form on GET
exports.sub_cateogry_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Sub Category delete GET');
});


// Handle Category delete on POST
exports.sub_category_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Sub Category delete POST');
});