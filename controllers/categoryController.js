require('dotenv').config();

const asyncHandler = require('express-async-handler');
const { DateTime } = require('luxon');
const { body, validationResult } = require('express-validator');
const db_queries = require('../db/queries');
const db_category = require('../db/category_queries');


// Displays index page with inventory overview stats
exports.index = asyncHandler(async (req, res, next) => {
  const currentDate = DateTime.now().toLocaleString(DateTime.DATETIME_FULL);
  const inventoryOverview = await db_queries.getInventoryOverview();

  res.render('index', {
    title: 'Grocery Inventory App',
    categories: inventoryOverview,
    current_date_time: currentDate,
  });
});


// Displays list of all Categories
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await db_category.getCategoryNames();

  res.render('category_list', {
    title: 'Category List',
    category_list: allCategories,
  });
});


// Display detail page for a specific Category
exports.category_detail = asyncHandler(async (req, res, next) => {
  const categoryList = await db_category.getCategoryList(req.params.id);
  const selectedCategory = await db_category.getSelectedCategory(req.params.id);

  if (categoryList === null) {
    const err = new Error('Category not found!');
    err.status = 404;
    return next(err);
  }

  res.render('category_detail', {
    title: `${selectedCategory[0].category_name} Items`,
    description: selectedCategory[0].category_description,
    catId: selectedCategory[0].id,
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
    const name = req.body.name;
    const cat_description = req.body.cat_description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'Create Category',
        name: name,
        cat_description: cat_description,
        errors: errors.array(),
      });
      return;
    } else {
      await db_category.createCategory(name, cat_description);
      res.redirect('/inventory/categories');
    }
  }),
];


// Display Category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await db_category.getSelectedCategory(req.params.id);

  if(category === null) {
    const err = new Error('Category not found!');
    err.status = 404;
    return next(err);
  }

  res.render('category_update', {
    title: 'Update Category',
    category: category[0],
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
    const selectedCategory = await db_category.getSelectedCategory(req.params.id);

    if(!errors.isEmpty()) {
      res.render('category_update', {
        title: 'Update Category',
        category: selectedCategory[0],
        errors: errors.array(),
      });
      return;
    } else {
      await db_category.updateCategory(req.body.name, req.body.cat_description, req.params.id);
      res.redirect('/inventory/categories');
    }
  }),
];


// Display Category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const selectedCategory = await db_category.getSelectedCategory(req.params.id);
  const subcategoryList = await db_category.getAssignedSubcategories(req.params.id);
  const category_items = await db_category.getCategoryList(req.params.id);

  res.render('category_delete', {
    title: `Delete Category: ${selectedCategory[0].category_name}`,
    category: selectedCategory[0],
    subcategory_list: subcategoryList,
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
    const selectedCategory = await db_category.getSelectedCategory(req.params.id);
    const subcategoryList = await db_category.getAssignedSubcategories(req.params.id);
    const category_items = await db_category.getCategoryList(req.params.id);

    if((subcategoryList.length > 0) || (category_items.length > 0)) {
      res.render('category_delete', {
        title: `Delete Category: ${selectedCategory[0].name}`,
        category: selectedCategory[0],
        subcategory_list: subcategoryList,
        category_items: category_items,
      });
      return;
    } else if(!errors.isEmpty()) {
      res.render('category_delete', {
        title: `Delete Category: ${selectedCategory[0].name}`,
        category: selectedCategory[0],
        subcategory_list: subcategoryList,
        category_items: category_items,
        password: req.body.password,
        errors: errors.array(),
      });
    } else {
        await db_category.deleteCategory(req.params.id);
        res.redirect('/inventory/categories');
      }
    })
];
