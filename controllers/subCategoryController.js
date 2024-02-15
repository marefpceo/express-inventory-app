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
  const subcategory = await SubCategory.findById(req.params.id).exec();
  const categories = await Category.find().sort({ name: 1 }).exec();

  if(subcategory === null) {
    const err = new Error('Subcategory not found!');
    err.status = 404;
    return next(err);
  }

  res.render('sub_category_update', {
    title: 'Update Subcategory',
    categories: categories,
    subcategory: subcategory,
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
  .isLength({ min: 3 })
  .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const categories = await Category.find().sort({ name: 1 }).exec();
    const subcategory = new SubCategory({
      name: req.body.subcatName,
      category: await Category.findById(req.body.categorySelect),
      _id: req.params.id,
    });

    if(!errors.isEmpty()) {
      res.render('sub_category_update', {
        title: 'Update Subcategory',
        subcategory: subcategory,
        categories: categories,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedSubCategory = await SubCategory.findByIdAndUpdate(req.params.id, subcategory, {}).exec();
      res.redirect(updatedSubCategory.url);
    }
  })
];


// Display Category delete form on GET
exports.sub_cateogry_delete_get = asyncHandler(async (req, res, next) => {
  const [ subcategory, subcategory_items ] = await Promise.all([
    await SubCategory.findById(req.params.id).exec(),
    Item.find({ sub_category: req.params.id }, 'name brand number_in_stock low_limit').sort({ name: 1 }).exec(),
  ]);

  if (subcategory === null) {
    res.redirect('/inventory/subcateogries');
  }

  res.render('sub_category_delete', {
    title: `Delete ${subcategory.name}`,
    subcategory: subcategory,
    subcategory_items: subcategory_items,
  });
});


// Handle Category delete on POST
exports.sub_category_delete_post = asyncHandler(async (req, res, next) => {
  const [ subcategory, subcategory_items ] = await Promise.all([
    await SubCategory.findById(req.params.id).exec(),
    Item.find({ sub_category: req.params.id }, 'name brand number_in_stock low_limit').sort({ name: 1 }).exec(),
  ]);

  if(subcategory_items.length > 0) {
    res.render('sub_category_delete', {
      title: `Delete ${subcategory.name}`,
      subcategory: subcategory,
      subcategory_items: subcategory_items,
    });
    return;
  } else {
    await SubCategory.findByIdAndDelete(req.params.id).exec();
    res.redirect('/inventory/subcategories');
  }
});
