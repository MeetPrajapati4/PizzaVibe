import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import { Cart, CartItem } from '../models/Cart.js';
import Pizza from '../models/Pizza.js';
import User from '../models/User.js';
import { sequelize } from '../config/db.js';

export const createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { street, city, state, zipCode, phone, paymentMethod = 'cod' } = req.body;
    
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{ model: Pizza, as: 'pizza' }]
      }]
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalAmount = 0;
    cart.items.forEach(item => {
      totalAmount += parseFloat(item.pizza.price) * item.quantity;
    });

    const order = await Order.create({
      userId: req.user.id,
      totalAmount,
      street,
      city,
      state,
      zipCode,
      phone,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
    }, { transaction: t });

    for (const item of cart.items) {
      await OrderItem.create({
        orderId: order.id,
        pizzaId: item.pizza.id,
        name: item.pizza.name,
        image: item.pizza.image,
        price: item.pizza.price,
        quantity: item.quantity,
        size: item.size
      }, { transaction: t });
    }

    // Clear cart items
    await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });

    await t.commit();
    res.status(201).json(order);
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
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

export const getAllOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status && status !== 'all') where.status = status;

    const orders = await Order.findAll({
      where,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] },
        { model: OrderItem, as: 'items' }
      ]
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.update({
      status,
      ...(status === 'delivered' && { paymentStatus: 'completed' })
    });

    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const getAdminStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum('totalAmount', { where: { paymentStatus: 'completed' } }) || 0;
    const totalUsers = await User.count({ where: { role: 'user' } });
    
    const recentOrders = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'user', attributes: ['name'] }]
    });

    res.json({
      totalOrders,
      totalRevenue,
      totalUsers,
      recentOrders
    });
  } catch (error) {
    next(error);
  }
};


