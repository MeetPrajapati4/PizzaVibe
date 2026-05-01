import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
}, { timestamps: true });

export const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  cartId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  pizzaId: {
    type: DataTypes.UUID,
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
}, { timestamps: false });

export default Cart;
