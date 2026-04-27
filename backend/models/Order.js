import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const Order = sequelize.define('Order', {
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.ENUM('cod', 'online'),
    defaultValue: 'cod'
  },
  couponApplied: {
    type: DataTypes.STRING,
    allowNull: true
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
});

Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

export default Order;
