import { Pizza } from './backend/models/index.js';

async function checkDb() {
  try {
    const count = await Pizza.count();
    console.log('Pizza Count:', count);
    const pizzas = await Pizza.findAll({ limit: 1 });
    console.log('Sample Pizza:', JSON.stringify(pizzas[0], null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDb();
