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

// Returns all category names
async function getCategoryNames() {
  const { rows } = await pool.query('SELECT category_name FROM category');
  return rows;
}

// Returns list of items for a specific category name
async function getCategoryList(category) {
  const { rows } = await pool.query(`
    SELECT * FROM items, category
    WHERE (items.category_id = category.id) AND (category.category_name = $1)
    `, [category]);
  return rows;
}

module.exports = {
  getInventoryOverview,
  getCategoryNames,
  getCategoryList,
}
