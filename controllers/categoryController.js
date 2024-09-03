require('dotenv').config();

const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const Item = require('../models/item');
const asyncHandler = require('express-async-handler');
const { DateTime } = require('luxon');
const { body, validationResult } = require('express-validator');
const db = require('../db/queries');


// Displays index page with inventory overview stats
exports.index = asyncHandler(async (req, res, next) => {
  const currentDate = DateTime.now().toLocaleString(DateTime.DATETIME_FULL);
  const inventoryOverview = await db.getInventoryOverview();

  res.render('index', {
    title: 'Grocery Inventory App',
    categories: inventoryOverview,
    current_date_time: currentDate,
  });
});


// Displays list of all Categories
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await db.getCategoryNames();

  res.render('category_list', {
    title: 'Category List',
    category_list: allCategories,
  });
});


// Display detail page for a specific Category
exports.category_detail = asyncHandler(async (req, res, next) => {
  const categoryList = await db.getCategoryList(req.params.id);

  if (categoryList === null) {
    const err = new Error('Category not found!');
    err.status = 404;
    return next(err);
  }

  res.render('category_detail', {
    title: `${req.params.id} Items`,
    category: categoryList,
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
    .withMessage('Category must contain at least 3 characters')
    .escape(),
  body('cat_description')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Description must contain at least 3 characters')
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
  const category = await Category.findById(req.params.id).exec();

  if(category === null) {
    const err = new Error('Category not found!');
    err.status = 404;
    return next(err);
  }

  res.render('category_update', {
    title: 'Update Category',
    category: category,
  });
});


// Handle Category update form on POST
exports.category_update_post = [
  body('name')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Category must contain at least 3 characters')
    .escape(),
  body('cat_description')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Description must contain at least 3 characters')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const category = new Category({
      name: req.body.name,
      cat_description: req.body.cat_description,
      _id: req.params.id,
    });

    if(!errors.isEmpty()) {
      res.render('category_update', {
        title: 'Update Category',
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {}).exec()
      res.redirect(updatedCategory.url);
    }
  }),
];


// Display Category delete form on GET
exports.cateogry_delete_get = asyncHandler(async (req, res, next) => {
  const [ category, subcategory_list, category_items ] = await Promise.all([
    Category.findById(req.params.id).exec(),
    SubCategory.find({ category: req.params.id }, 'name').sort({ name: 1 }).exec(),
    Item.find({ category: req.params.id }, 'name brand').sort({ name: 1 }).exec(),
  ]);

  res.render('category_delete', {
    title: `Delete Category: ${category.name}`,
    category: category,
    subcategory_list: subcategory_list,
    category_items: category_items,
  });
});


// Handle Category delete on POST
exports.category_delete_post = [
  body('password')
    .trim()
    .matches(process.env.ADMIN_PASSWORD)
    .withMessage('Password Incorrect')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const [ category, subcategory_list, category_items ] = await Promise.all([
      Category.findById(req.params.id).exec(),
      SubCategory.find({ category: req.params.id }, 'name').sort({ name: 1 }).exec(),
      Item.find({ category: req.params.id }, 'name brand').sort({ name: 1 }).exec(),
    ]);

    if((subcategory_list.length > 0) || (category_items.length > 0)) {
      res.render('category_delete', {
        title: `Delete Category: ${category.name}`,
        category: category,
        subcategory_list: subcategory_list,
        category_items: category_items,
      });
      return;
    } else if(!errors.isEmpty()) {
      res.render('category_delete', {
        title: `Delete Category: ${category.name}`,
        category: category,
        subcategory_list: subcategory_list,
        category_items: category_items,
        password: req.body.password,
        errors: errors.array(),
      });
    } else {
        await Category.findByIdAndDelete(req.params.id).exec();
        res.redirect('/inventory/categories');
      }
    })
];
