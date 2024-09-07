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
  console.log(item);

  if (item === null) {
    const err = new Error('Item not found!');
    err.status = 404;
    return next(err);
  }

  res.render('item_detail', {
    title: 'Detail Page',
    item: item,
    stored_item_image: item.item_image_url === null || undefined || '' ? '/images/Placeholder-view.png' : `/uploads/${item.item_image_url}`,
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
  
  console.log(item);

  res.render('item_update', {
    title: 'Update Item',
    item: item[0],
    categories: categories,
    sub_categories: subcategories,
    stored_item_image: item[0].item_image_url === null || undefined || '' ? '/images/Placeholder-view.png' : `/uploads/${item[0].item_image_url}`,
  });
});




//////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// CURRENTLY IN WORK /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////


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
    const currentItemImage = await Item.findById(req.params.id).exec();
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
        item_image: typeof req.file === 'undefined' ? currentItemImage.item_image : req.file.filename,
        _id: req.params.id,
      })
    ]);
    

    if(!errors.isEmpty()) {
      res.render('item_update', {
        title: 'Update Item',
        item: item,
        categories: categories,
        sub_categories: sub_categories,
        stored_item_image: item.item_image,
        errors: errors.array(),
      });
      return;
    } else {
        if(currentItemImage.item_image !== item.item_image) {
          try {
            unlinkSync(`public/uploads/${currentItemImage.item_image}`);
          } catch (err) {
            console.log(err);
            return next(err);
          }
        }

        const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {}).exec();
        res.redirect(updatedItem.url);
      }
  })
];



//////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////// BELOW THIS LINE NOT UPDATED ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////





// Display Item delete form on GET
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();

  if(item === null) {
    const err = Error('Item not found!');
    err.status = 404;
    return next(err);
  }

  res.render('item_delete', {
    title: 'Delete Item',
    item: item,
    item_category: await Category.findById(item.category).exec(),
    item_subcategory: await SubCategory.findById(item.sub_category).exec(),
    stored_item_image: item.item_image === '' ? '/images/Placeholder-view.png' : `/uploads/${item.item_image}`,
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
    const item = await Item.findById(req.params.id).exec();

    if (!errors.isEmpty()){
      res.render('item_delete', {
        title: 'Delete Item',
        item: item,
        item_category: await Category.findById(item.category).exec(),
        item_subcategory: await SubCategory.findById(item.sub_category).exec(),
        stored_item_image: item.item_image === '' ? '/images/Placeholder-view.png' : `/uploads/${item.item_image}`,
        password: req.body.password,
        errors: errors.array(),
      });
      return;
    } else {
        await Item.findByIdAndDelete(req.params.id).exec();
        if(item.item_image !== '') {
          try {
            unlinkSync(`public/uploads/${item.item_image}`);
          } catch (err) {
            console.log(err);
            return next(err);
          }
        }
        res.redirect('/inventory/items');
      }
    })
];