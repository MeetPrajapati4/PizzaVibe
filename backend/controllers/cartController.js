import { Cart } from '../models/Cart.js';
import Pizza from '../models/Pizza.js';

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [], totalAmount: 0 });
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { pizzaId, quantity, size } = req.body;
    const pizza = await Pizza.findById(pizzaId);
    if (!pizza) return res.status(404).json({ message: 'Pizza not found' });

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [], totalAmount: 0 });
    }

    const price = pizza[`${size}_price`] || pizza.price;
    const existingItemIndex = cart.items.findIndex(
      item => item.pizzaId.toString() === pizzaId && item.size === size
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        pizzaId,
        name: pizza.name,
        image: pizza.image,
        price,
        quantity,
        size
      });
    }

    cart.totalAmount = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { id: itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    item.quantity = Number(quantity);
    cart.totalAmount = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { id: itemId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    cart.totalAmount = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (cart) {
      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};
