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
      items.low_limit, category.category_name, subcategories.subcategory_name 
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


module.exports = {
  getItemsList,
  getLowStockItems,
  getItem,
  getAllCategories,
  getAllSubcategories,
}