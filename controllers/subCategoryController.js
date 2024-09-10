require('dotenv').config();

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const db_subcategory = require('../db/subcategory_queries');
const db_category = require('../db/category_queries');

// Displays list of all Categories
exports.sub_category_list = asyncHandler(async (req, res, next) => {
  const allSubcategories = await db_subcategory.getSubcategoryNames();
  res.render('sub_category_list', {
    title: 'Subcategory List',
    subcategory_list: allSubcategories,
  });
});


// Display detail page for a specific Category
exports.sub_category_detail = asyncHandler(async (req, res, next) => {
  const subcategory = await db_subcategory.getSubcategoryItemsList(req.params.id);
  const subcategoryName = await db_subcategory.getSelectedSubcategory(req.params.id);

  if (subcategory === null) {
    const err = new Error('Subcategory not found!');
    err.status = 404;
    return next(err);
  }

  res.render('sub_category_detail', {
    title: `${subcategoryName[0].subcategory_name} List`,
    category: subcategoryName[0].category_name,
    subcatId: req.params.id,
    subcategory: subcategory
  });
});


// Display Category create form on GET
exports.sub_category_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await db_category.getCategoryNames();

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
    .isNumeric()
    .escape(),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const allCategories = await db_category.getCategoryNames();

    if (!errors.isEmpty()) {
      res.render('sub_category_form', {
        title: 'Create Subcategory',
        subcategory: req.body.subcatName,
        categories: allCategories,
        errors: errors.array(),
      });
      return;
    } else {
      await db_subcategory.createSubcategory(req.body.subcatName, req.body.categorySelect);
      res.redirect('/inventory/subcategories');
    }
  }),
];


// Display Subcategory update form on GET
exports.sub_category_update_get = asyncHandler(async (req, res, next) => {
  const categories = await db_category.getCategoryNames();
  const subcategory = await db_subcategory.getSelectedSubcategory(req.params.id);

  if(subcategory === null) {
    const err = new Error('Subcategory not found!');
    err.status = 404;
    return next(err);
  }

  res.render('sub_category_update', {
    title: 'Update Subcategory',
    categories: categories,
    subcategory: subcategory[0],
  });
});


// Handle Category update form on POST
exports.sub_category_update_post = [
  body('subcatName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Subcategory must contain at least 3 characters')
    .escape(),
  body('categorySelect')
    .trim()
    .isNumeric()
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const categories = await db_category.getCategoryNames();
    const subcategory = await db_subcategory.getSelectedSubcategory(req.params.id);

    if(!errors.isEmpty()) {
      res.render('sub_category_update', {
        title: 'Update Subcategory',
        subcategory: subcategory[0],
        categories: categories,
        errors: errors.array(),
      });
      return;
    } else {
      await db_subcategory.updateSubcategory(req.body.subcatName, req.body.categorySelect, req.params.id);
      res.redirect('/inventory/subcategories');
    }
  })
];


// Display Subcategory delete form on GET
exports.sub_cateogry_delete_get = asyncHandler(async (req, res, next) => {
  const subcategory = await db_subcategory.getSelectedSubcategory(req.params.id);
  const subcategoryList = await db_subcategory.getSubcategoryItemsList(req.params.id);

  if (subcategory === null) {
    res.redirect('/inventory/subcateogries');
  }

  res.render('sub_category_delete', {
    title: `Delete ${subcategory[0].subcategory_name}`,
    subcategory: subcategory[0],
    subcategory_items: subcategoryList,
  });
});


// Handle Subcategory delete on POST
exports.sub_category_delete_post = [
  body('password')
    .trim()
    .matches(process.env.ADMIN_PASSWORD)
    .withMessage('Password Incorrect')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const subcategory = await db_subcategory.getSelectedSubcategory(req.params.id);
    const subcategoryList = await db_subcategory.getSubcategoryItemsList(req.params.id);

    if(subcategoryList.length > 0) {
      res.render('sub_category_delete', {
        title: `Delete ${subcategory[0].subcategory_name}`,
        subcategory: subcategory,
        subcategory_items: subcategoryList,
      });
      return;
    } else if(!errors.isEmpty()) {
        res.render('sub_category_delete', {
          title: `Delete ${subcategory[0].subcategory_name}`,
          subcategory: subcategory,
          subcategory_items: subcategoryList,
          password: req.body.password,
          errors: errors.array(),
        });
      } else {
          await db_subcategory.deleteSubcategory(req.params.id);
          res.redirect('/inventory/subcategories');
      }
  })
];

