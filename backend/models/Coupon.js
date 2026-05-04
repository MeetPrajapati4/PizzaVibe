import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  discount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  minOrder: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  maxDiscount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  usedCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  expiryDate: { type: DataTypes.DATE, allowNull: true }
}, { 
  timestamps: true,
  tableName: 'coupons'
});

export default Coupon;
