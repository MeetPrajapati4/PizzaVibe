import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Pizza = sequelize.define('Pizza', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  category: { 
    type: DataTypes.STRING, 
    defaultValue: 'veg' 
  },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  small_price: { type: DataTypes.DECIMAL(10, 2) },
  medium_price: { type: DataTypes.DECIMAL(10, 2) },
  large_price: { type: DataTypes.DECIMAL(10, 2) },
  isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
  averageRating: { type: DataTypes.FLOAT, defaultValue: 4.5 },
  totalReviews: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { 
  timestamps: true,
  tableName: 'pizzas'
});

export default Pizza;
