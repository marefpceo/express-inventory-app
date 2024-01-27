const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
  brand: { type: String, required: true, minLength: 3, maxLength: 100 },
  description: { type: String, required: true, minLength: 3, maxLength: 120 },
  price: { type: Number, required: true },
  number_in_stock: { type: Number, required: true },
  low_limit: { type: Number, required: true },
  category: { type: String, required: true },
  sub_category: { type: String, required: true },
});

ItemSchema.virtual('url').get(function () {
  return `/inventory/item/${this._id}`;
});

module.exports = mongoose.model('Item', ItemSchema);