import User from '../models/User.js';
import Order from '../models/Order.js';
import Pizza from '../models/Pizza.js';
import Coupon from '../models/Coupon.js';

// ─── User Management ──────────────────────────────────────

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    next(error);
  }
};

export const toggleUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.email === 'Admin@Boss') {
      return res.status(403).json({ message: 'Cannot modify the primary admin account' });
    }

    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();

    return res.json({ message: `User role updated to ${user.role}`, role: user.role });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.email === 'Admin@Boss') {
      return res.status(403).json({ message: 'Cannot delete the primary admin account' });
    }

    await User.findByIdAndDelete(req.params.id);
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── Coupon Management ─────────────────────────────────────

export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
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

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
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
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    return res.json(coupon);
  } catch (error) {
    next(error);
  }
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    return res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── Enhanced Dashboard Stats ──────────────────────────────

export const getEnhancedStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalPizzas = await Pizza.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    const activeCoupons = await Coupon.countDocuments({ isActive: true });

    // Orders by status breakdown
    const statusBreakdown = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);

    // Recent 10 orders
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Top selling pizzas (Simplified using aggregation on orders)
    const topPizzas = await Order.aggregate([
      { $unwind: '$items' },
      { $group: {
          _id: '$items.name',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
      }},
      { $project: { name: '$_id', totalSold: 1, totalRevenue: 1, _id: 0 } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // Revenue over last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, paymentStatus: 'completed' } },
      { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
      }},
      { $project: { date: '$_id', revenue: 1, orders: 1, _id: 0 } },
      { $sort: { date: 1 } }
    ]);

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
