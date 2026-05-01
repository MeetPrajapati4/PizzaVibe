import { sequelize } from '../config/db.js';
import User from './User.js';
import Pizza from './Pizza.js';
import { Cart, CartItem } from './Cart.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Coupon from './Coupon.js';

// Associations

// User <-> Cart
User.hasOne(Cart, { foreignKey: 'userId', as: 'cart' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Cart <-> CartItem
Cart.hasMany(CartItem, { foreignKey: 'cartId', as: 'items', onDelete: 'CASCADE' });
CartItem.belongsTo(Cart, { foreignKey: 'cartId', as: 'cart' });

// CartItem <-> Pizza
CartItem.belongsTo(Pizza, { foreignKey: 'pizzaId', as: 'pizza' });

// User <-> Order
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Order <-> OrderItem
// OrderItem.js already has some associations defined, but it's better to define them all here to avoid circular dependencies.
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// OrderItem <-> Pizza
OrderItem.belongsTo(Pizza, { foreignKey: 'pizzaId', as: 'pizza' });

// Ensure models sync if needed (though usually done via migrations or manual sync)
// sequelize.sync({ alter: true });

const models = {
  User,
  Pizza,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Coupon
};

export { 
  User, 
  Pizza, 
  Cart, 
  CartItem,
  Order, 
  OrderItem,
  Coupon 
};

export default models;
