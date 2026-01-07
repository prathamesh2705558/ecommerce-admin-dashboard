import mongoose, { model, Schema, models } from "mongoose";

const ProductSchema = new Schema({
  name: {type: String, required: true},
  description: String,
  price: {type: Number, required: true},
  category: String,
  stock: {type: Number, required: true},
  sold: {type: Number, default: 0},
}, {
  timestamps: true, // <--- THIS SAVES THE DATE AUTOMATICALLY
});

export const Product = models.Product || model("Product", ProductSchema);