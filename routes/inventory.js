const express = require('express');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({ 
  // Define the destination to save the image file
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },

  // Create a new file name with extension and unique identifier. All spaces are also
  // replaced with and underscore '_'
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const nameSplit = file.originalname.toLowerCase().replace(/ /g, '_').split('.');
    cb(null, nameSplit[0] + '-' + uniqueSuffix + '.' + nameSplit[1]);
  }
});

const upload = multer({ storage: storage });

// Require controller modules
const category_controller = require('../controllers/categoryController');
const sub_category_controller = require('../controllers/subCategoryController');
const item_controller = require('../controllers/itemController');

/// CATEGORY ROUTES ///

// GET inventory home page
router.get('/', category_controller.index);

// GET request for creating a Category. NOTE This must come before route that using id
router.get('/category/create', category_controller.category_create_get);

// POST request for creating a Category
router.post('/category/create', category_controller.category_create_post);

// GET request to update a Category
router.get('/category/:id/update', category_controller.category_update_get);

// Post request to update a Category
router.post('/category/:id/update', category_controller.category_update_post);

// GET request to delete a Category
router.get('/category/:id/delete', category_controller.category_delete_get);

// POST request to delete a Category
router.post('/category/:id/delete', category_controller.category_delete_post);

// GET request for one Category
router.get('/category/:id', category_controller.category_detail);

// GET request for list of all Categories
router.get('/categories', category_controller.category_list);


/// SUB CATEGORY ROUTES ///

// GET request for creating a Sub Category. NOTE This must come before route that using id
router.get('/subcategory/create', sub_category_controller.sub_category_create_get);

// POST request for creating a Sub Category
router.post('/subcategory/create', sub_category_controller.sub_category_create_post);

// GET request to update a Sub Category
router.get('/subcategory/:id/update', sub_category_controller.sub_category_update_get);

// Post request to update a Sub Category
router.post('/subcategory/:id/update', sub_category_controller.sub_category_update_post);

// GET request to delete a Sub Category
router.get('/subcategory/:id/delete', sub_category_controller.sub_cateogry_delete_get);

// POST request to delete a Sub Category
router.post('/subcategory/:id/delete', sub_category_controller.sub_category_delete_post);

// GET request for one Sub Category
router.get('/subcategory/:id', sub_category_controller.sub_category_detail);

// GET request for list of all Sub Categories
router.get('/subcategories', sub_category_controller.sub_category_list);


/// ITEM ROUTES ///

// GET request for creating an Item. NOTE This must come before route that using id
router.get('/item/create', item_controller.item_create_get);

// POST request for creating an Item
router.post('/item/create', upload.single('item_image_url'), item_controller.item_create_post);

// GET request to update an Item
router.get('/item/:id/update', item_controller.item_update_get);

// Post request to update an Item
router.post('/item/:id/update', upload.single('item_image_url'), item_controller.item_update_post);

// GET request to delete an Item
router.get('/item/:id/delete', item_controller.item_delete_get);

// POST request to delete an Item
router.post('/item/:id/delete', item_controller.item_delete_post);

// GET request for one Item
router.get('/item/:id', item_controller.item_detail);

// GET request for list of all Items
router.get('/items', item_controller.item_list);

// GET request for list of low stock Items
router.get('/items/item_low_stock', item_controller.item_low_stock);

module.exports = router;
