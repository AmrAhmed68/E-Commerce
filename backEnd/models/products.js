const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Clothing item must have a name"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Product must belong to a category"],
    },
    subcategory: {
      type: String,
      required: [true, "Product must have a subcategory"],
      trim: true,
    },
    size: {
      type: [String],
      required: [false, "Clothing item must have available sizes"],
      // enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    color: {
      type: [String],
      required: [true, "Clothing item must have available colors"],
    },
    price: {
      type: Number,
      required: [true, "Clothing item must have a price"],
      min: [0, "Price cannot be negative"],
    },
    stock: {
      type: Number,
      required: [true, "Clothing item must have a stock value"],
      min: [0, "Stock cannot be negative"],
    },
    section : {
      type: String,
      required: [false, "Product must belong to a section"],
    },
    brand: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Clothing item must have an image URL"],
    },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      reviews: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          userName: { type: String, ref: "User" },
          comment: { type: String, trim: true },
          rating: { type: Number, required: true, min: 1, max: 5 },
          createdAt: { type: Date, default: Date.now },
        },
      ],
    },
  });
  
ProductSchema.methods.addReview = async function (userId, rating) {
  const existingReview = this.ratings.reviews.find(
    (review) => review.userId.toString() === userId.toString()
  );

  if (existingReview) {
    throw new Error('User has already reviewed this product.');
  }

  this.ratings.reviews.push({ userId, userName , rating, createdAt: new Date() });
  const totalRatings = this.ratings.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.ratings.average = totalRatings / this.ratings.reviews.length;
  return this.save();
};
  
module.exports = mongoose.model('Product', ProductSchema);
