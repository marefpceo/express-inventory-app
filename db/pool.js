require('dotenv').config();
const { Pool } = require('pg');

module.exports = new Pool({
  connectionString: (process.env.POSTGRESQL_URI || process.env.POSTGRESQL_URI_REMOTE)
});
