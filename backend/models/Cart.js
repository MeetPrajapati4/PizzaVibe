import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  pizzaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza', required: true },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  size: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' }
});

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  totalAmount: { type: Number, default: 0 }
}, { timestamps: true });

export const Cart = mongoose.model('Cart', cartSchema);
export const CartItem = null; // No longer needed as a separate model in Mongo
export default Cart;
