import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import Pizza from './Pizza.js';

const Cart = sequelize.define('Cart', {
  coupon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
});

Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });

const CartItem = sequelize.define('CartItem', {
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

CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items' });

CartItem.belongsTo(Pizza, { foreignKey: 'pizzaId', as: 'pizza' });

export { Cart, CartItem };
export default Cart;
