const pool = require('./pool');

// Returns list of all Items
async function getItemsList() {
  const { rows } = await pool.query(`
    SELECT id, name, brand, number_in_stock, low_limit FROM items
    ORDER BY name ASC;
    `);
  return rows;
}

// Returns list of all Low Stock Items
async function getLowStockItems() {
  const { rows } = await pool.query(`
    SELECT id, name, brand, number_in_stock, low_limit FROM items
    WHERE number_in_stock < low_limit
    ORDER BY name ASC;
    `);
  return rows;
}

// Returns selected item 
async function getItem(itemId) {
  const { rows } = await pool.query(`
    SELECT items.id, items.name, items.brand, items.description, items.price, items.number_in_stock, 
      items.low_limit, items.category_id, items.subcategory_id, items.item_image_url, category.category_name, 
      subcategories.subcategory_name 
    FROM items 
    LEFT JOIN category ON items.category_id = category.id 
    LEFT JOIN subcategories ON items.subcategory_id = subcategories.id
    WHERE items.id = ($1)
  `, [itemId]);
  return rows;
}

// Returns list of all categories
async function getAllCategories() {
  const { rows } = await pool.query(`
    SELECT * FROM category;
    `); 
  return rows;
}

// Returns list of all subcategories
async function getAllSubcategories() {
  const { rows } = await pool.query(`
    SELECT * FROM subcategories;
    `); 
  return rows;
}

// Create a new item
async function createItem(name, brand, description, price, number_in_stock, low_limit, category_id, 
    subcategory_id, item_image_url) {
  await pool.query(`
    INSERT INTO items (name, brand, description, price, number_in_stock, low_limit, category_id, 
      subcategory_id, item_image_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)  
  `, [name, brand, description, price, number_in_stock, low_limit, category_id, subcategory_id, 
      item_image_url]);
}


// Update selected item
async function updateItem(name, brand, description, price, number_in_stock, low_limit, category_id, 
  subcategory_id, item_image_url, id) {
    await pool.query(`
      UPDATE items
      SET name = ($1), brand = ($2), description = ($3), price = ($4), number_in_stock = ($5), 
        low_limit = ($6), category_id = ($7), subcategory_id = ($8), item_image_url = ($9)
      WHERE id = ($10)
    `, [name, brand, description, price, number_in_stock, low_limit, category_id, subcategory_id, 
      item_image_url, id]);
}

// Delete selected item
async function deleteItem(itemId) {
  await pool.query(`
    DELETE FROM items
    WHERE id = ($1)
  `, [itemId]);
}


module.exports = {
  getItemsList,
  getLowStockItems,
  getItem,
  getAllCategories,
  getAllSubcategories,
  createItem,
  updateItem,
  deleteItem
}