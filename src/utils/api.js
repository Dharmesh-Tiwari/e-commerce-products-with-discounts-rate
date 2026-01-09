import axios from 'axios';

const API_BASE_URL = 'https://stageapi.monkcommerce.app/task/products';
const API_KEY = process.env.REACT_APP_API_KEY || 'YOUR_API_KEY_HERE'; // Replace with your API key

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json'
  }
});

export const fetchProducts = async ({ search = '', page = 0, limit = 10 }) => {
  try {
    const response = await api.get('/search', {
      params: {
        search,
        page,
        limit
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

// Mock data for development
export const mockProducts = [
  {
    id: 77,
    title: "Fog Linen Chambray Towel - Beige Stripe",
    variants: [
      { id: 1, product_id: 77, title: "XS / Silver", price: "49" },
      { id: 2, product_id: 77, title: "S / Silver", price: "49" },
      { id: 3, product_id: 77, title: "M / Silver", price: "49" }
    ],
    image: {
      id: 266,
      product_id: 77,
      src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/77/images/266/foglinenbeigestripetowel1b.1647248662.386.513.jpg?c=1"
    }
  },
  {
    id: 80,
    title: "Orbit Terrarium - Large",
    variants: [
      { id: 64, product_id: 80, title: "Default Title", price: "109" }
    ],
    image: {
      id: 272,
      product_id: 80,
      src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/80/images/272/roundterrariumlarge.1647248662.386.513.jpg?c=1"
    }
  }
];