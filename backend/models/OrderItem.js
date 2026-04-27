import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Order from './Order.js';
import Pizza from './Pizza.js';

const OrderItem = sequelize.define('OrderItem', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  size: {
    type: DataTypes.ENUM('small', 'medium', 'large'),
    defaultValue: 'medium'
  }
});

OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });

OrderItem.belongsTo(Pizza, { foreignKey: 'pizzaId', as: 'pizza' });

export default OrderItem;
