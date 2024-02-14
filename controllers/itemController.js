const Item = require('../models/item');
const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');


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
  const item = await Item.findById(req.params.id).populate('category sub_category').exec();

  if (item === null) {
    const err = new Error('Item not found!');
    err.status = 404;
    return next(err);
  }

  res.render('item_detail', {
    title: 'Detail Page',
    item: item,
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
exports.item_create_post = [
  body('itemName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must contain a minimum of 3 characters')
    .escape(),
  body('itemBrand')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Brand must contain a minimum of 3 characters')
    .escape(),
  body('itemPrice')
    .trim()
    .isCurrency({ allow_negatives: false })
    .withMessage('Price must be a numeric value')
    .escape(),
  body('itemStockCount')
    .trim()
    .isNumeric()
    .withMessage('In Stock must be a numeric value 0 or greater')
    .escape(),
  body('itemLowLimit')
    .trim()
    .isNumeric()
    .withMessage('Low Limit must be a numeric value 0 or greater')
    .escape(),
  body('itemDescription')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Description must contain a minimum of 3 characters')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const [ allCategories, allSubCategories, item ] = await Promise.all([
      Category.find().sort({ name: 1 }).exec(),
      SubCategory.find().sort({ name: 1 }).exec(),
      new Item({
        name: req.body.itemName,
        brand: req.body.itemBrand,
        price: req.body.itemPrice,
        number_in_stock: req.body.itemStockCount,
        low_limit: req.body.itemLowLimit,
        description: req.body.itemDescription,
        sub_category: await SubCategory.findById(req.body.categorySelect).exec(),
        category: await Category.findById(
          (await SubCategory.findById(req.body.categorySelect).exec()).category
          ),
      }),
    ]);

    if (!errors.isEmpty()) {
      res.render('item_form', {
        title: 'Create Item',
        item: item,
        categories: allCategories,
        sub_categories: allSubCategories,
        errors: errors.array(),
      });
      return;
    } else {
      await item.save();
      res.redirect(item.url);
    }
  })
];


// Display Item update form on GET
exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [ item, categories, subcategories ] = await Promise.all([
    Item.findById(req.params.id).exec(),
    Category.find().sort({ name: 1 }).exec(),
    SubCategory.find().sort({ name: 1 }).exec(),
  ]);
  
  res.render('item_update', {
    title: 'Update Item',
    item: item,
    categories: categories,
    sub_categories: subcategories,
  });
});


// Handle Item update form on POST
exports.item_update_post = [
  body('itemName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Name must contain a minimum of 3 characters'),
  body('itemBrand')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Brand must contain a minimum of 3 characters')
    .escape(),
  body('itemPrice')
    .trim()
    .isCurrency({ allow_negatives: false })
    .withMessage('Price must be a numeric value')
    .escape(),
  body('itemStockCount')
    .trim()
    .isNumeric()
    .withMessage('In Stock must be a numeric value 0 or greater')
    .escape(),
  body('itemLowLimit')
    .trim()
    .isNumeric()
    .withMessage('Low Limit must be a numeric value 0 or greater')
    .escape(),
  body('itemDescription')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Description must contain a minimum of 3 characters')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const [ categories, sub_categories, item ] = await Promise.all([
      Category.find().sort({ name: 1 }).exec(),
      SubCategory.find().sort({ name: 1 }).exec(),
      new Item({
        name: req.body.itemName,
        brand: req.body.itemBrand,
        price: req.body.itemPrice,
        number_in_stock: req.body.itemStockCount,
        low_limit: req.body.itemLowLimit,
        description: req.body.itemDescription,
        sub_category: await SubCategory.findById(req.body.categorySelect).exec(),
        category: await Category.findById(
          (await SubCategory.findById(req.body.categorySelect).exec()).category),
        _id: req.params.id,
      })
    ]);
    
    if(!errors.isEmpty()) {
      res.render('item_update', {
        title: 'Update Item',
        item: item,
        categories: categories,
        sub_categories: sub_categories,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {}).exec();
      res.redirect(updatedItem.url);
    }
  })
];


// Display Item delete form on GET
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item delete GET');
});


// Handle Item delete on POST
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Item delete POST');
});