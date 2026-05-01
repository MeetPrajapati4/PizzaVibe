import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  usedCount: { type: Number, default: 0 },
  expiryDate: { type: Date, required: false }
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);
