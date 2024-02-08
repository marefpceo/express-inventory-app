const Item = require('../models/item');
const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const asyncHandler = require('express-async-handler');


// Displays list of all Items
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().sort({ name: 1 }).exec();

  res.render('item_list', {
    title: 'Item List',
    item_list: allItems,
  });
});


// Displays list of all low stock items
exports.item_low_stock = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().sort({ name: 1 }).exec();

  res.render('item_low_stock', {
    title: 'Low Stock Items',
    low_stock_list: allItems,
  });
});


// Display detail page for a specific Item
exports.item_detail = asyncHandler(async (req, res, next) => {
  const itemDetail = await Item.findById(req.params.id).populate('category sub_category').exec();

  res.render('item_detail', {
    title: 'Detail Page',
    itemDetail: itemDetail,
  });
});


// Display Item create form on GET
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const [allCategories, allSubCategories] = await Promise.all([
    Category.find().sort({ name: 1 }).exec(),
    SubCategory.find().sort({ name: 1 }).exec(),
  ]);

  res.render('item_form', {
    title: 'Create Item',
    categories: allCategories,
    sub_categories: allSubCategories,
  });
});


// Handle Item create on POST
exports.item_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item create POST');
});


// Display Item update form on GET
exports.item_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item update GET');
});


// Handle Item update form on POST
exports.item_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item update POST');
});


// Display Item delete form on GET
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item delete GET');
});


// Handle Item delete on POST
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item delete POST');
});