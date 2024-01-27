const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
  cat_description: { type: String, required: true, minLength: 4, maxLength: 120 },
});

CategorySchema.virtual('url').get(function () {
  return `/inventory/category/${this._id}`;
});

module.exports = mongoose.model('Category', CategorySchema);