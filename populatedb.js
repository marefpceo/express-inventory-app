#! /usr/bin/env node

console.log(
  'This script populates some test items, categories and sub categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://<username>:<password>@cluster0.lz91hw2.mongodb.net/inventory_app?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require('./models/category');
const SubCategory = require('./models/subCategory');
const Item = require('./models/item');

const categories = [];
const subCategories = [];
const items = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createCategories();
  await createSubCategories();
  await createItems();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// Create category and use index to maintain order, regardless of order in which promises complete
async function categoryCreate(index, name, cat_description) {
  const category = new Category({
    name: name,
    cat_description: cat_description,
  });

  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function subCategoryCreate(index, name, category) {
  const sub_category = new SubCategory({
    name: name,
    category: category,
  });

  await sub_category.save();
  subCategories[index] = sub_category;
  console.log(`Added sub-category: ${name}`);
}

async function itemCreate(index, name, brand, description, price, number_in_stock, low_limit,
  category, sub_category, item_image){
    const item = new Item({
      name: name,
      brand: brand,
      description: description,
      price: price,
      number_in_stock: number_in_stock,
      low_limit: low_limit,
      category: category,
      sub_category: sub_category,
      item_image: item_image,
    });

    await item.save();
    items[index] = item;
    console.log(`Added item: ${name}`);
  }


async function createCategories() {
  console.log('Adding Categories');
  await Promise.all([
    categoryCreate(0, 'Freezer', 'Inventory of all frozen foods'),
    categoryCreate(1, 'Chilled', 'Inventory of all refrigerated foods'),
    categoryCreate(2, 'Shelf-Stable', 'Inventory of all shelf-stable foods'),
  ]);
}

async function createSubCategories() {
  console.log('Adding Sub-Categories');
  await Promise.all([
    subCategoryCreate(0, 'Ice cream', categories[0]),
    subCategoryCreate(1, 'Pizza, Frozen', categories[0]),
    subCategoryCreate(2, 'Vegetables', categories[0]),
    subCategoryCreate(3, 'Beverages', categories[1]),
    subCategoryCreate(4, 'Pizza', categories[1]),
    subCategoryCreate(5, 'Raw Meat', categories[1]),
    subCategoryCreate(6, 'Dry Beans', categories[2]),
    subCategoryCreate(7, 'Cereal', categories[2]),
    subCategoryCreate(8, 'Canned Goods', categories[2]),
  ]);
}

async function createItems() {
  console.log('Adding Items');
  await Promise.all([
    itemCreate(
      0,
      'Chocolate Ice Cream',
      'Blue Bell',
      '16oz',
      5.99,
      20,
      5,
      categories[0],
      subCategories[0],
      '',
    ),
    itemCreate(
      1,
      'Four Cheese Pizza',
      'Red Barron',
      'Personal Size',
      10.89,
      10,
      15,
      categories[0],
      subCategories[1],
      '',
    ),
    itemCreate(
      2,
      'Spinach',
      'Birdseye',
      '16oz, frozen',
      1.29,
      30,
      10,
      categories[0],
      subCategories[2],
      '',
    ),
    itemCreate(
      3,
      'Strawberry Ice Cream',
      'Breyers',
      '16oz',
      4.93,
      20,
      5,
      categories[0],
      subCategories[0],
      '',
    ),
    itemCreate(
      4,
      'Supreme Pizza',
      'Take N Bake',
      'Large (16in)',
      15.98,
      2,
      3,
      categories[1],
      subCategories[4],
      '',
    ),
    itemCreate(
      5,
      'Whole Milk',
      'Horizon',
      'quart',
      2.99,
      10,
      28,
      categories[1],
      subCategories[3],
      '',
    ),
    itemCreate(
      6,
      'Orange Juice',
      'Simply',
      '64oz',
      3.89,
      15,
      3,
      categories[1],
      subCategories[3],
      '',
    ),
    itemCreate(
      7,
      'Chicken Thighs, boneless, skinless',
      'Foster Farms',
      'Per pound',
      1.79,
      180,
      50,
      categories[1],
      subCategories[5],
      '',
    ),
    itemCreate(
      8,
      'Beef, ground, 92% lean/ 8% fat',
      'Harris Ranch',
      'Per pound',
      2.09,
      232,
      70,
      categories[1],
      subCategories[5],
      '',
    ),
    itemCreate(
      9,
      'Pinto Beans, dry',
      `Hurst's`,
      '1lb, 16oz',
      2.38,
      42,
      15,
      categories[2],
      subCategories[6],
      '',
    ),
    itemCreate(
      10,
      'Cherrios',
      'General Mills',
      '8.9oz',
      3.68,
      18,
      5,
      categories[2],
      subCategories[7],
      '',
    ),
    itemCreate(
      11,
      'Pinto Beans',
      'S&W',
      '15.5oz can',
      1.28,
      26,
      10,
      categories[2],
      subCategories[8],
      '',
    ),
  ]);
}

