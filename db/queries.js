const pool = require('./pool');

// Returns all category names
async function getCategoryNames() {
  const { rows } = await pool.query('SELECT category_name FROM category');
  return rows;
}

// Returns total number of items by category
async function getTotalItems() {
  const { rows } = await pool.query('SELECT COUNT(*) FROM items ');
  return rows;
}

module.exports = {
  getCategoryNames,
  getTotalItems,
}
