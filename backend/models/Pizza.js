import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Pizza = sequelize.define('Pizza', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  small_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  medium_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  large_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  category: {
    type: DataTypes.ENUM('veg', 'non-veg', 'premium'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 1),
    defaultValue: 0
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

export default Pizza;
