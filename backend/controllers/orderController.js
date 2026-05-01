import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import { Cart, CartItem } from '../models/Cart.js';
import User from '../models/User.js';

export const createOrder = async (req, res, next) => {
  try {
    const { street, city, state, zipCode, phone, paymentMethod, couponApplied, discount } = req.body;
    
    const cart = await Cart.findOne({ 
      where: { userId: req.user.id },
      include: [{ model: CartItem, as: 'items' }]
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const order = await Order.create({
      userId: req.user.id,
      totalAmount: cart.totalAmount - (discount || 0),
      street,
      city,
      state,
      zipCode,
      phone,
      paymentMethod,
      couponApplied,
      discount: discount || 0,
      paymentStatus: paymentMethod === 'online' ? 'completed' : 'pending'
    });

    // Create OrderItems from CartItems
    const orderItems = cart.items.map(item => ({
      orderId: order.id,
      pizzaId: item.pizzaId,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
      size: item.size
    }));

    await OrderItem.bulkCreate(orderItems);

    // Clear cart after order
    await CartItem.destroy({ where: { cartId: cart.id } });
    await cart.update({ totalAmount: 0 });

    // Fetch the complete order to return
    const completeOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    res.status(201).json(completeOrder);
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [{ model: OrderItem, as: 'items' }]
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Check ownership
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    await order.update({ status });
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] },
        { model: OrderItem, as: 'items' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};
