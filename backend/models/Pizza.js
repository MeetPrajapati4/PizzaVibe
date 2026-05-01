import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
  category: { type: String, enum: ['veg', 'non-veg', 'premium'], default: 'veg' },
  price: { type: Number, required: true },
  small_price: { type: Number },
  medium_price: { type: Number },
  large_price: { type: Number },
  isAvailable: { type: Boolean, default: true },
  averageRating: { type: Number, default: 4.5 },
  totalReviews: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Pizza', pizzaSchema);
