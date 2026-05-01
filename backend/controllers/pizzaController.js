import { Op } from 'sequelize';
import Pizza from '../models/Pizza.js';

export const getAllPizzas = async (req, res, next) => {
  try {
    const { category, search, sort, minPrice, maxPrice } = req.query;
    
    let whereClause = { isAvailable: true };

    if (category && category !== 'all') {
      whereClause.category = category;
    }
    
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = Number(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = Number(maxPrice);
    }
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    let orderClause = [['createdAt', 'DESC']];
    if (sort === 'price_asc') orderClause = [['price', 'ASC']];
    else if (sort === 'price_desc') orderClause = [['price', 'DESC']];
    else if (sort === 'rating') orderClause = [['averageRating', 'DESC']];
    else if (sort === 'name') orderClause = [['name', 'ASC']];

    const pizzas = await Pizza.findAll({
      where: whereClause,
      order: orderClause
    });
    
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
  try {
    const pizza = await Pizza.findByPk(req.params.id);
    if (!pizza) return res.status(404).json({ message: 'Pizza not found' });

    const currentTotal = pizza.totalReviews || 0;
    const currentRating = pizza.averageRating || 0;
    const newRating = Number(req.body.rating);

    const updatedTotal = currentTotal + 1;
    const updatedRating = ((currentRating * currentTotal) + newRating) / updatedTotal;

    pizza.totalReviews = updatedTotal;
    pizza.averageRating = updatedRating;
    await pizza.save();

    res.status(201).json({ message: 'Review added', averageRating: pizza.averageRating });
  } catch (error) {
    next(error);
  }
};
