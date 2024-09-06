const pool = require('./pool');

// Returns all subcategory names
async function getSubcategoryNames() {
  const { rows }= await pool.query('SELECT id, subcategory_name FROM subcategories');
  return rows;
}

// Return selected subcategory 
async function getSubcategory(subcategoryId) {
  const { rows } = await pool.query(`
    SELECT subcategories.id, subcategories.subcategory_name, subcategories.category_id, category.category_name FROM subcategories, category 
    WHERE (subcategories.id = $1) AND (category.id = subcategories.category_id)
    `, [subcategoryId]);
  return rows;
}

// Returns list of items for a specific subcategory name
async function getSubcategoryItemsList(subcategoryId) {
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

// Updates selected subcategory
async function updateSubcategory(subcategoryName, categoryId, subcategoryId) {
  await pool.query(`
    UPDATE subcategories 
    SET subcategory_name = ($1), category_id = ($2)
    WHERE id = ($3)
    `, [subcategoryName, categoryId, subcategoryId]);
}

module.exports = {
  getSubcategoryNames,
  getSubcategory,
  getSubcategoryItemsList,
  createSubcategory,
  updateSubcategory,
}