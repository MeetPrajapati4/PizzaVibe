import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  street: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  zipCode: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
  paymentStatus: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'cod'
  },
  couponApplied: { type: DataTypes.STRING },
  discount: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 }
}, { timestamps: true });

export default Order;
