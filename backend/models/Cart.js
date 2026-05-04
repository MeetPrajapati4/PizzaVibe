import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
}, { 
  timestamps: true,
  tableName: 'carts'
});

export const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cartId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pizzaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  size: { 
    type: DataTypes.STRING, 
    defaultValue: 'medium' 
  }
}, { 
  timestamps: false,
  tableName: 'cartitems'
});

export default Cart;
