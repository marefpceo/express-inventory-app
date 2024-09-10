require('dotenv').config();

const Item = require('../models/item');
const Category = require('../models/category');
const SubCategory = require('../models/subCategory');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { unlinkSync } =require('node:fs');
const db_items = require('../db/item_queries');
const db_subcategory = require('../db/subcategory_queries');


// Displays list of all Items
exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await db_items.getItemsList();

  res.render('item_list', {
    title: 'Item List',
    item_list: allItems,
  });
});


// Displays list of all low stock items
exports.item_low_stock = asyncHandler(async (req, res, next) => {
  const lowStockItems = await db_items.getLowStockItems();

  res.render('item_low_stock', {
    title: 'Low Stock Items',
    low_stock_list: lowStockItems,
  });
});


// Display detail page for a specific Item
exports.item_detail = asyncHandler(async (req, res, next) => {
  const temp = await db_items.getItem(req.params.id);
  const item = temp[0];

  if (item === null) {
    const err = new Error('Item not found!');
    err.status = 404;
    return next(err);
  }

  res.render('item_detail', {
    title: 'Detail Page',
    item: item,
    stored_item_image: item.item_image_url === (null || undefined || '') ? '/images/Placeholder-view.png' : `/uploads/${item.item_image_url}`,
  });
});


// Display Item create form on GET
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await db_items.getAllCategories();
  const allSubCategories = await db_items.getAllSubcategories();

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
    const allCategories = await db_items.getAllCategories();
    const allSubCategories = await db_items.getAllSubcategories();
    const selectedSubcategory = await db_subcategory.getSelectedSubcategory(req.body.subCategorySelect);
    const item = {
      name: req.body.itemName,
      brand: req.body.itemBrand,
      description: req.body.itemDescription,
      price: req.body.itemPrice,
      number_in_stock: req.body.itemStockCount,
      low_limit: req.body.itemLowLimit,
      category_id: selectedSubcategory[0].category_id,
      subcategory_id: req.body.subCategorySelect,
      item_image_url: typeof req.file === 'undefined' ? '' : req.file.filename,
    }

    if (!errors.isEmpty()) {
      res.render('item_form', {
        title: 'Create Item',
        item: item,
        categories: allCategories,
        sub_categories: allSubCategories,
        errors: errors.array(),
      });

        try {
          unlinkSync(`public/uploads/${item.item_image_url}`);
        } catch (err) {
          console.log(err);
          return next(err);
        }
        
      return;
    } else {
      await db_items.createItem(item.name, item.brand, item.description, item.price, item.number_in_stock,
        item.low_limit, item.category_id, item.subcategory_id, item.item_image_url);
      res.redirect('/inventory/items');
    }
  })
];


// Display Item update form on GET
exports.item_update_get = asyncHandler(async (req, res, next) => {
  const item = await db_items.getItem(req.params.id);
  const categories = await db_items.getAllCategories();
  const subcategories = await db_items.getAllSubcategories();

  res.render('item_update', {
    title: 'Update Item',
    item: item[0],
    categories: categories,
    sub_categories: subcategories,
    stored_item_image: item[0].item_image_url === (null || undefined || '') ? '/images/Placeholder-view.png' : `/uploads/${item[0].item_image_url}`,
  });
});


// Handle Item update form on POST
exports.item_update_post = [
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
    const allCategories = await db_items.getAllCategories();
    const allSubCategories = await db_items.getAllSubcategories();
    const selectedSubcategory = await db_subcategory.getSelectedSubcategory(req.body.subCategorySelect);
    const currentItem = await db_items.getItem(req.params.id);    
    const currentItemImage = currentItem[0].item_image_url === null ? '' : currentItem[0].item_image_url;
    const item = {
      name: req.body.itemName,
      brand: req.body.itemBrand,
      description: req.body.itemDescription,
      price: req.body.itemPrice,
      number_in_stock: req.body.itemStockCount,
      low_limit: req.body.itemLowLimit,
      category_id: selectedSubcategory[0].category_id,
      subcategory_id: req.body.subCategorySelect,
      item_image_url: typeof req.file === 'undefined' ? currentItemImage : req.file.filename,
    }
   
    if(!errors.isEmpty()) {
      res.render('item_update', {
        title: 'Update Item',
        item: currentItem[0],
        categories: allCategories,
        sub_categories: allSubCategories,
        stored_item_image: item.item_image_url === (null || undefined || '') ? '/images/Placeholder-view.png' : `/uploads/${item.item_image_url}`,
        errors: errors.array(),
      });
      return;
    } else {
        if((currentItemImage !== item.item_image_url) && (currentItemImage !== '')) {
          try {
            unlinkSync(`public/uploads/${currentItemImage}`);
          } catch (err) {
            console.log(err);
            return next(err);
          }
        }
        await db_items.updateItem(item.name, item.brand, item.description, item.price, item.number_in_stock,
          item.low_limit, item.category_id, item.subcategory_id, item.item_image_url, req.params.id);
        res.redirect(`/inventory/item/${req.params.id}`);
      }
  })
];


// Display Item delete form on GET
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const currentItem = await db_items.getItem(req.params.id);
  const item = currentItem[0];

  if(item === null) {
    const err = Error('Item not found!');
    err.status = 404;
    return next(err);
  }

  console.log(item);
  res.render('item_delete', {
    title: 'Delete Item',
    item: item,
    stored_item_image: item.item_image_url === '' ? '/images/Placeholder-view.png' : `/uploads/${item.item_image_url}`,
  });
});


// Handle Item delete on POST
exports.item_delete_post = [
  body('password')
    .trim()
    .matches(process.env.ADMIN_PASSWORD)
    .withMessage('Password Incorrect')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const currentItem = await db_items.getItem(req.params.id);
    const item = currentItem[0];

    if (!errors.isEmpty()){
      res.render('item_delete', {
        title: 'Delete Item',
        item: item,
        stored_item_image: item.item_image_url === '' ? '/images/Placeholder-view.png' : `/uploads/${item.item_image_url}`,
        password: req.body.password,
        errors: errors.array(),
      });
      return;
    } else {
        if(item.item_image !== '') {
          try {
            unlinkSync(`public/uploads/${item.item_image_url}`);
          } catch (err) {
            console.log(err);
            return next(err);
          }
        }
        await db_items.deleteItem(req.params.id);
        res.redirect('/inventory/items');
      }
    })
];
