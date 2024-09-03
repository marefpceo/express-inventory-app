#! /usr/bin/env node
require('dotenv').config();
const { Client } = require("pg");

const CATEGORY = `
CREATE TABLE IF NOT EXISTS category (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category_name VARCHAR ( 255 ),
  category_description VARCHAR ( 255 )
);

INSERT INTO category (category_name, category_description) 
VALUES
  ('Freezer', 'Inventory of all frozen foods'),
  ('Chilled', 'Inventory of all refrigerated foods'),
  ('Shelf-Stable', 'Inventory of all shelf-stable foods');
`;

const SUBCATEGORIES = `
CREATE TABLE IF NOT EXISTS subcategories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  subcategory_name VARCHAR ( 255 ),
  category_id INT,
  FOREIGN KEY (category_id) REFERENCES category(id)
);

INSERT INTO subcategories (subcategory_name, category_id)
VALUES
  ('Ice Cream', 1),
  ('Pizza, Frozen', 1),
  ('Vegetables', 1),
  ('Beverages', 2),
  ('Pizza', 2),
  ('Raw Meat', 2),
  ('Dry Beans', 3),
  ('Cereal', 3),
  ('Canned Goods', 3);
`;

const ITEMS = `
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR ( 255 ),
  brand VARCHAR ( 255 ),
  description VARCHAR ( 255 ),
  price DECIMAL(10, 2),
  number_in_stock INT,
  low_limit INT,
  category_id INT,
  subcategory_id INT, 
  item_image_url TEXT,
  FOREIGN KEY (category_id) REFERENCES category(id),
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
);

INSERT INTO items (name, brand, description, price, number_in_stock, low_limit, category_id, subcategory_id)
VALUES
  ('Chocolate Ice Cream', 'Blue Bell', '16oz', 5.99, 20, 5, 1, 1),
  ('Four Cheese Pizza', 'Red Barron', 'Personal Size', 10.89, 10, 15, 1, 2),
  ('Spinach', 'Birdseye', '16oz, frozen', 1.29, 30, 10, 1, 3),
  ('Strawberry Ice Cream', 'Breyers', '16oz', 4.93, 20, 5, 1, 1),
  ('Supreme Pizza', 'Take N Bake', 'Large (16in)', 15.98, 2, 3, 2, 5),
  ('Whole Milk', 'Horizon', 'quart', 2.99, 10, 28, 2, 4),
  ('Orange Juice', 'Simply', '64oz', 3.89, 15, 3, 2, 4),
  ('Chicken Thighs, boneless, skinless', 'Foster Farms', 'Per pound', 1.79, 180, 50, 2, 6),
  ('Beef, ground, 92% lean/ 8% fat', 'Harris Ranch', 'Per pound', 2.09, 232, 70, 2, 6),
  ('Pinto Beans, dry', 'Hurst''s', '1lb, 16oz', 2.38, 42, 15, 3, 7),
  ('Cherrios', 'General Mills', '8.9oz', 3.68, 18, 5, 3, 8),
  ('Pinto Beans', 'S&W', '15.5oz can', 1.28, 26, 10, 3, 9);
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.POSTGRESQL_URI,
  });
  await client.connect();
  await client.query(CATEGORY);
  await client.query(SUBCATEGORIES);
  await client.query(ITEMS);
  await client.end();
  console.log("done");
}

main();
