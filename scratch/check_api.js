import axios from 'axios';

async function checkApi() {
  try {
    const response = await axios.get('http://localhost:5001/api/pizzas');
    console.log('Status:', response.status);
    console.log('Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkApi();
