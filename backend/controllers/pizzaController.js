import Pizza from '../models/Pizza.js';
import { Op } from 'sequelize';

export const getAllPizzas = async (req, res, next) => {
  console.log('🔍 Fetching pizzas with query:', req.query);
  try {
    const { category, search, sort, minPrice, maxPrice } = req.query;
    const where = { isAvailable: true };

    if (category && category !== 'all') where.category = category;
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }
    
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    let order = [['createdAt', 'DESC']];
    if (sort === 'price_asc') order = [['price', 'ASC']];
    else if (sort === 'price_desc') order = [['price', 'DESC']];
    else if (sort === 'rating') order = [['averageRating', 'DESC']];
    else if (sort === 'name') order = [['name', 'ASC']];

    const pizzas = await Pizza.findAll({ where, order });
    res.json({ pizzas, total: pizzas.length });
  } catch (error) {
    next(error);
  }
};

export const getPizzaById = async (req, res, next) => {
  try {
    const pizza = await Pizza.findByPk(req.params.id);
    if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
    res.json(pizza);
  } catch (error) {
    next(error);
  }
};

export const createPizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.create(req.body);
    res.status(201).json(pizza);
  } catch (error) {
    next(error);
  }
};

export const updatePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findByPk(req.params.id);
    if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
    
    await pizza.update(req.body);
    res.json(pizza);
  } catch (error) {
    next(error);
  }
};

export const deletePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findByPk(req.params.id);
    if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
    
    await pizza.destroy();
    res.json({ message: 'Pizza deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  // Simple implementation for now - you might want a separate Review model
  try {
    const pizza = await Pizza.findByPk(req.params.id);
    if (!pizza) return res.status(404).json({ message: 'Pizza not found' });

    // For SQL, we usually use a separate table. 
    // This is a simplified version where we just update the pizza stats.
    const currentTotal = pizza.totalReviews || 0;
    const currentRating = parseFloat(pizza.averageRating) || 0;
    const newRating = parseFloat(req.body.rating);

    const updatedTotal = currentTotal + 1;
    const updatedRating = ((currentRating * currentTotal) + newRating) / updatedTotal;

    await pizza.update({
      totalReviews: updatedTotal,
      averageRating: updatedRating.toFixed(1)
    });

    res.status(201).json({ message: 'Review added', averageRating: pizza.averageRating });
  } catch (error) {
    next(error);
  }
};
