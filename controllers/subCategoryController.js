const SubCategory = require('../models/subCategory');
const asyncHandler = require('express-async-handler');

// Displays list of all Categories
exports.sub_category_list = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Sub Category list');
});

// Display detail page for a specific Category
exports.sub_category_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Sub Category detail: ${req.params.id}`);
});

// Display Category create form on GET
exports.sub_category_create_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Sub Category create GET');
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
exports.sub_category_update_get = asyncHandler(async (req, res, next) => {
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