import mongoose, { model, Schema, models } from "mongoose";

const SaleSchema = new Schema({
  productName: String,
  price: Number,
  date: { type: Date, default: Date.now },
});

// We use 'models.Sale' if it exists, otherwise we create it. 
// The 'as any' fixes the TypeScript red line on 'models'.
export const Sale = (models as any).Sale || model("Sale", SaleSchema);