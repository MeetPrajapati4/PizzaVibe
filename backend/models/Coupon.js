import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Coupon = sequelize.define('Coupon', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  discount: {
    type: DataTypes.INTEGER, // Percentage
    allowNull: false
  },
  minOrder: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  maxDiscount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  usedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  expiryDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

export default Coupon;
