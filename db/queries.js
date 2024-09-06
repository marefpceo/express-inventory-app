const pool = require('./pool');

// Returns inventory overview for index page
async function getInventoryOverview() {
  const { rows } = await pool.query(`
    SELECT category.id, category.category_name, COUNT(items.category_id) AS total_items, 
      SUM(items.number_in_stock) AS total_units
    FROM category, items
    WHERE category.id = items.category_id
    GROUP BY category.id, items.category_id
    ORDER BY category.id ASC`);
  return rows;
}


///////////////////////////////////////////////////////
/////////////// Item Controller Queries ///////////////
///////////////////////////////////////////////////////



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

module.exports = {
  getInventoryOverview,
  getItemsList,
  getLowStockItems,
  getItem,
}
