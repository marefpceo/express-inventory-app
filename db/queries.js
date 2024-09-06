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


///////////////////////////////////////////////////////////
/////////////// Category Controller Queries ///////////////
///////////////////////////////////////////////////////////


// Returns all category names
async function getCategoryNames() {
  const { rows } = await pool.query(`
    SELECT id, category_name FROM category
    ORDER BY category_name ASC
    `);
  return rows;
}

// Returns selected category
async function getSelectedCategory(categoryId) {
  const { rows } = await pool.query(`
    SELECT * FROM category
    WHERE (id = $1)  
    `, [categoryId]);
  return rows;
}

// Returns list of items for a specific category name
async function getCategoryList(category) {
  const { rows } = await pool.query(`
    SELECT items.*, category.category_name FROM items              
    LEFT JOIN category ON items.category_id = category.id
    WHERE items.category_id = ($1)
    `, [category]);
  return rows;
}

//Returns list of subcategories assigned to specific category
async function getAssignedSubcategories(categoryId) {
  const { rows } = await pool.query(`
    SELECT * FROM subcategories
    WHERE category_id = ($1)
    `, [categoryId]);
  return rows;
}

// Creates a new category entry
async function createCategory(name, description) {
  await pool.query(`
    INSERT INTO category (category_name, category_description)
    VALUES ($1, $2)
    `, [name, description]);
}

// Updates selected category
async function updateCategory(name, description, id) {
  await pool.query(`
    UPDATE category
    SET category_name = ($1), category_description = ($2)
    WHERE id = ($3)
    `, [name, description, id]);
}

// Delete selected category
async function deleteCategory(categoryId) {
  await pool.query(`
    DELETE FROM category
    WHERE id = ($1)
    `, [categoryId]);
}


//////////////////////////////////////////////////////////////
/////////////// Subcategory Controller Queries ///////////////
//////////////////////////////////////////////////////////////



// Returns all subcategory names
async function getSubcategoryNames() {
  const { rows }= await pool.query('SELECT id, subcategory_name FROM subcategories');
  return rows;
}

// Return selected subcategory name 
async function getSubcategory(subcategoryId) {
  const { rows } = await pool.query(`
    SELECT subcategories.subcategory_name, category.category_name FROM subcategories, category 
    WHERE (subcategories.id = $1) AND (category.id = subcategories.category_id)
    `, [subcategoryId]);
  return rows;
}

// Returns list of items for a specific subcategory name
async function getSubcategoryList(subcategoryId) {
  const { rows } = await pool.query(`
    SELECT * FROM items, subcategories
    WHERE (items.subcategory_id = $1) 
      AND (subcategories.id = items.subcategory_id)
    `, [subcategoryId]);
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
  getSelectedCategory,
  getAssignedSubcategories,
  getCategoryNames,
  getCategoryList,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategoryNames,
  getSubcategory,
  getSubcategoryList,
  getItemsList,
  getLowStockItems,
  getItem,
}
