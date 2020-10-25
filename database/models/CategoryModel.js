const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: String.required.unique,
    familyId: { type: ObjectId, ref: 'Family' },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Category', CategorySchema);
