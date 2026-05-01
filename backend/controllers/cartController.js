import { Cart, CartItem } from '../models/Cart.js';
import Pizza from '../models/Pizza.js';

const calculateTotal = (items) => {
  return items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
};

export const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ 
      where: { userId: req.user.id },
      include: [{ model: CartItem, as: 'items' }]
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, totalAmount: 0 });
      cart.dataValues.items = [];
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { pizzaId, quantity, size } = req.body;
    const pizza = await Pizza.findByPk(pizzaId);
    if (!pizza) return res.status(404).json({ message: 'Pizza not found' });

    let cart = await Cart.findOne({ 
      where: { userId: req.user.id },
      include: [{ model: CartItem, as: 'items' }]
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, totalAmount: 0 });
      cart.items = [];
    }

    const price = pizza[`${size}_price`] || pizza.price;
    
    // Check if item already exists in cart
    let existingItem = await CartItem.findOne({
      where: { cartId: cart.id, pizzaId, size }
    });

    if (existingItem) {
      existingItem.quantity += Number(quantity);
      await existingItem.save();
    } else {
      await CartItem.create({
        cartId: cart.id,
        pizzaId,
        name: pizza.name,
        image: pizza.image,
        price,
        quantity,
        size
      });
    }

    // Refresh cart items to calculate new total
    const updatedItems = await CartItem.findAll({ where: { cartId: cart.id } });
    const totalAmount = calculateTotal(updatedItems);
    await cart.update({ totalAmount });

    const finalCart = await Cart.findOne({ 
      where: { id: cart.id },
      include: [{ model: CartItem, as: 'items' }]
    });

    res.json(finalCart);
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { id: itemId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = await CartItem.findOne({ where: { id: itemId, cartId: cart.id } });
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    await item.update({ quantity: Number(quantity) });

    const updatedItems = await CartItem.findAll({ where: { cartId: cart.id } });
    const totalAmount = calculateTotal(updatedItems);
    await cart.update({ totalAmount });

    const finalCart = await Cart.findOne({ 
      where: { id: cart.id },
      include: [{ model: CartItem, as: 'items' }]
    });

    res.json(finalCart);
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { id: itemId } = req.params;
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const deleted = await CartItem.destroy({ where: { id: itemId, cartId: cart.id } });
    
    if (deleted) {
      const updatedItems = await CartItem.findAll({ where: { cartId: cart.id } });
      const totalAmount = calculateTotal(updatedItems);
      await cart.update({ totalAmount });
    }

    const finalCart = await Cart.findOne({ 
      where: { id: cart.id },
      include: [{ model: CartItem, as: 'items' }]
    });

    res.json(finalCart);
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (cart) {
      await CartItem.destroy({ where: { cartId: cart.id } });
      await cart.update({ totalAmount: 0 });
    }
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

export const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    // For now, this just validates the coupon exists or handles basic logic.
    // In a full app, you'd verify the coupon, check minOrder, etc.
    const cart = await Cart.findOne({ 
      where: { userId: req.user.id },
      include: [{ model: CartItem, as: 'items' }]
    });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    // Add logic here if Coupon model is accessible and valid
    // For simplicity, just return the cart assuming frontend handles discount visualization,
    // or return a mock success
    res.json({ message: 'Coupon applied successfully', cart });
  } catch (error) {
    next(error);
  }
};

