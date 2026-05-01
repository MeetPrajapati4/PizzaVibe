import Pizza from '../models/Pizza.js';

export const getAllPizzas = async (req, res, next) => {
  try {
    const { category, search, sort, minPrice, maxPrice } = req.query;
    const query = { isAvailable: true };

    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { averageRating: -1 };
    else if (sort === 'name') sortOption = { name: 1 };

    const pizzas = await Pizza.find(query).sort(sortOption);
    res.json({ pizzas, total: pizzas.length });
  } catch (error) {
    next(error);
  }
};

export const getPizzaById = async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
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
    const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
    res.json(pizza);
  } catch (error) {
    next(error);
  }
};

export const deletePizza = async (req, res, next) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
    res.json({ message: 'Pizza deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
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
