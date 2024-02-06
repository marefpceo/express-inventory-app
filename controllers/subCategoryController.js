const SubCategory = require('../models/subCategory');
const Category = require('../models/category');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');

// Displays list of all Categories
exports.sub_category_list = asyncHandler(async (req, res, next) => {
  const allSubcategories = await SubCategory.find().sort({ name: 1 });
  
  res.render('sub_category_list', {
    title: 'Subcategory List',
    subcategory_list: allSubcategories,
  });
});


// Display detail page for a specific Category
exports.sub_category_detail = asyncHandler(async (req, res, next) => {
  const [subcategory, itemsInSubcategory] = await Promise.all([
    SubCategory.findById(req.params.id).populate('category').exec(),
    Item.find({ sub_category: req.params.id }, 'name brand number_in_stock low_limit').sort({ name: 1 }).exec(),
  ]);

  res.render('sub_category_detail', {
    title: `${subcategory.name} List`,
    subcategory: subcategory,
    subcategory_items: itemsInSubcategory,
  });
});


// Display Category create form on GET
exports.sub_category_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 });

  res.render('sub_category_form', {
    title: 'Create Subcategory',
    categories: allCategories,
  });
});


// Handle Category create on POST
exports.sub_category_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Sub Category create POST');
});


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