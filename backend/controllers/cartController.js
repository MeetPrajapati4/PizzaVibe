import { Cart, CartItem } from '../models/Cart.js';
import Pizza from '../models/Pizza.js';

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{ model: Pizza, as: 'pizza' }]
      }]
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
      cart.items = [];
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { pizzaId, quantity = 1, size = 'medium' } = req.body;
    let cart = await Cart.findOne({ where: { userId: req.user.id } });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }

    let item = await CartItem.findOne({
      where: { cartId: cart.id, pizzaId, size }
    });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      await CartItem.create({
        cartId: cart.id,
        pizzaId,
        quantity,
        size
      });
    }

    const updatedCart = await Cart.findOne({
      where: { id: cart.id },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{ model: Pizza, as: 'pizza' }]
      }]
    });

    res.json(updatedCart);
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const item = await CartItem.findByPk(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.quantity = quantity;
    await item.save();

    res.json({ message: 'Quantity updated' });
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await CartItem.findByPk(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.destroy();
    res.json({ message: 'Item removed' });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id } });
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

export const applyCoupon = async (req, res, next) => {
  // Simplified for now - can integrate with Coupon model later
  try {
    const { code } = req.body;
    res.json({ message: 'Coupon logic to be integrated with SQL model' });
  } catch (error) {
    next(error);
  }
};
