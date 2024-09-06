const pool = require('./pool');

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

module.exports = {
  getCategoryNames,
  getSelectedCategory,
  getCategoryList,
  getAssignedSubcategories,
  createCategory,
  updateCategory,
  deleteCategory,
}