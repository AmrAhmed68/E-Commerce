const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema({
    category: {
      name : {
        type: String,
        required: true,
        unique: true,
      }, 
      subcategory : {
        type: [String],
      required: [true, "Clothing item must have a subcategory"],
      enum: ["T-shirts", "Pants", "hoodies", "Jackets" , "Bags" , "Socks" , "Watches"],
      trim: true,
      }
    }
});

module.exports = mongoose.model('categories', categoriesSchema);
