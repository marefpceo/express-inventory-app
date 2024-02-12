const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubCategorySchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
  // category: { type: Schema.Types.ObjectId, ref: 'Category' },
  category: { type: String, required: true, minLength: 3, maxLength: 100 },
});

SubCategorySchema.virtual('url').get(function () {
  return `/inventory/subcategory/${this._id}`;
});

module.exports = mongoose.model('SubCategory', SubCategorySchema);