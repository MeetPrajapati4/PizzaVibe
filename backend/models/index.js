import { sequelize } from '../config/db.js';
import User from './User.js';
import Pizza from './Pizza.js';
import { Cart, CartItem } from './Cart.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Coupon from './Coupon.js';

// This file centralizes all models and ensures they are registered with Sequelize
// It also ensures associations are established before synchronization

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
