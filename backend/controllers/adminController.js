import User from '../models/User.js';
import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import Pizza from '../models/Pizza.js';
import Coupon from '../models/Coupon.js';
import { sequelize } from '../config/db.js';
import { Op, fn, col, literal } from 'sequelize';

// ─── User Management ──────────────────────────────────────

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    return res.json(users);
  } catch (error) {
    next(error);
  }
};

export const toggleUserRole = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent modifying the fixed admin account
    if (user.email === 'Admin@Boss') {
      return res.status(403).json({ message: 'Cannot modify the primary admin account' });
    }

    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await user.update({ role: newRole });

    return res.json({ message: `User role updated to ${newRole}`, role: newRole });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.email === 'Admin@Boss') {
      return res.status(403).json({ message: 'Cannot delete the primary admin account' });
    }

    await user.destroy();
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── Coupon Management ─────────────────────────────────────

export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.findAll({ order: [['createdAt', 'DESC']] });
    return res.json(coupons);
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const { code, discount, minOrder, maxDiscount, expiryDate, isActive } = req.body;

    if (!code || discount === undefined) {
      return res.status(400).json({ message: 'Code and discount are required' });
    }

    const existing = await Coupon.findOne({ where: { code: code.toUpperCase() } });
    if (existing) {
      return res.status(409).json({ message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discount: Number(discount),
      minOrder: Number(minOrder || 0),
      maxDiscount: Number(maxDiscount || 0),
      expiryDate: expiryDate || new Date('2027-12-31'),
      isActive: isActive !== false
    });

    return res.status(201).json(coupon);
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    await coupon.update(req.body);
    return res.json(coupon);
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    await coupon.destroy();
    return res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── Enhanced Dashboard Stats ──────────────────────────────

export const getEnhancedStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.count();
    const totalRevenue = (await Order.sum('totalAmount', { where: { paymentStatus: 'completed' } })) || 0;
    const totalUsers = await User.count({ where: { role: 'user' } });
    const totalPizzas = await Pizza.count();
    const pendingOrders = await Order.count({ where: { status: 'pending' } });
    const deliveredOrders = await Order.count({ where: { status: 'delivered' } });
    const cancelledOrders = await Order.count({ where: { status: 'cancelled' } });
    const activeCoupons = await Coupon.count({ where: { isActive: true } });

    // Orders by status breakdown
    const statusBreakdown = await Order.findAll({
      attributes: ['status', [fn('COUNT', col('id')), 'count']],
      group: ['status'],
      raw: true
    });

    // Recent 10 orders
    const recentOrders = await Order.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] },
        { model: OrderItem, as: 'items' }
      ]
    });

    // Top selling pizzas
    const topPizzas = await OrderItem.findAll({
      attributes: [
        'name',
        [fn('SUM', col('quantity')), 'totalSold'],
        [fn('SUM', literal('price * quantity')), 'totalRevenue']
      ],
      group: ['name'],
      order: [[fn('SUM', col('quantity')), 'DESC']],
      limit: 5,
      raw: true
    });

    // Revenue over last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRevenue = await Order.findAll({
      attributes: [
        [fn('DATE', col('createdAt')), 'date'],
        [fn('SUM', col('totalAmount')), 'revenue'],
        [fn('COUNT', col('id')), 'orders']
      ],
      where: {
        createdAt: { [Op.gte]: sevenDaysAgo },
        paymentStatus: 'completed'
      },
      group: [fn('DATE', col('createdAt'))],
      order: [[fn('DATE', col('createdAt')), 'ASC']],
      raw: true
    });

    return res.json({
      totalOrders,
      totalRevenue,
      totalUsers,
      totalPizzas,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      activeCoupons,
      statusBreakdown,
      recentOrders,
      topPizzas,
      dailyRevenue
    });
  } catch (error) {
    next(error);
  }
};
