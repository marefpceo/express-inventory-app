const pool = require('./pool');

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

// Creates a new subcategory
async function createSubcategory(subcategoryName, categoryId) {
  const { rows } = await pool.query(`
    INSERT INTO subcategories (subcategory_name, category_id)
    VALUES ($1, $2)
    `, [subcategoryName, categoryId]);
    return rows;
}

module.exports = {
  getSubcategoryNames,
  getSubcategory,
  getSubcategoryList,
  createSubcategory,
}