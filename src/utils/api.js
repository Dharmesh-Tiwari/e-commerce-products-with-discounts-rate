import axios from 'axios';

const API_BASE_URL = 'https://stageapi.monkcommerce.app/task/products';
const API_KEY = '72njgfa948d9aS7gs5'; // Your API key

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
    
    // Fallback to mock data if API fails
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('API authentication failed, using mock data');
      return getMockProducts(search, page, limit);
    }
    
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

// Mock data for development and fallback
const getMockProducts = (search = '', page = 0, limit = 10) => {
  const allMockProducts = [
    {
      id: 77,
      title: "Fog Linen Chambray Towel - Beige Stripe",
      variants: [
        { id: 1, product_id: 77, title: "XS / Silver", price: "49" },
        { id: 2, product_id: 77, title: "S / Silver", price: "49" },
        { id: 3, product_id: 77, title: "M / Silver", price: "49" },
        { id: 4, product_id: 77, title: "L / Silver", price: "55" },
        { id: 5, product_id: 77, title: "XL / Silver", price: "60" }
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
    },
    {
      id: 81,
      title: "Classic Leather Sneakers",
      variants: [
        { id: 65, product_id: 81, title: "Black / 8", price: "89" },
        { id: 66, product_id: 81, title: "Black / 9", price: "89" },
        { id: 67, product_id: 81, title: "White / 8", price: "89" },
        { id: 68, product_id: 81, title: "White / 9", price: "89" }
      ],
      image: {
        id: 275,
        product_id: 81,
        src: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
    },
    {
      id: 82,
      title: "Wireless Bluetooth Headphones",
      variants: [
        { id: 69, product_id: 82, title: "Black", price: "129" },
        { id: 70, product_id: 82, title: "White", price: "129" },
        { id: 71, product_id: 82, title: "Blue", price: "139" }
      ],
      image: {
        id: 278,
        product_id: 82,
        src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
    },
    {
      id: 83,
      title: "Stainless Steel Water Bottle",
      variants: [
        { id: 72, product_id: 83, title: "500ml", price: "29" },
        { id: 73, product_id: 83, title: "750ml", price: "35" },
        { id: 74, product_id: 83, title: "1L", price: "45" }
      ],
      image: {
        id: 279,
        product_id: 83,
        src: "https://images.unsplash.com/photo-1523362628745-0c100150b504?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
    },
    {
      id: 84,
      title: "Organic Cotton T-Shirt",
      variants: [
        { id: 75, product_id: 84, title: "S / Black", price: "25" },
        { id: 76, product_id: 84, title: "M / Black", price: "25" },
        { id: 77, product_id: 84, title: "L / Black", price: "25" },
        { id: 78, product_id: 84, title: "S / White", price: "25" },
        { id: 79, product_id: 84, title: "M / White", price: "25" }
      ],
      image: {
        id: 280,
        product_id: 84,
        src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
    },
    {
      id: 85,
      title: "Ceramic Coffee Mug Set",
      variants: [
        { id: 80, product_id: 85, title: "Set of 2", price: "32" },
        { id: 81, product_id: 85, title: "Set of 4", price: "58" },
        { id: 82, product_id: 85, title: "Set of 6", price: "85" }
      ],
      image: {
        id: 281,
        product_id: 85,
        src: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
    },
    {
      id: 86,
      title: "Yoga Mat Premium",
      variants: [
        { id: 83, product_id: 86, title: "Purple", price: "45" },
        { id: 84, product_id: 86, title: "Blue", price: "45" },
        { id: 85, product_id: 86, title: "Green", price: "45" }
      ],
      image: {
        id: 282,
        product_id: 86,
        src: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
    },
    {
      id: 87,
      title: "Desk Lamp with Wireless Charger",
      variants: [
        { id: 86, product_id: 87, title: "Silver", price: "65" },
        { id: 87, product_id: 87, title: "Black", price: "65" }
      ],
      image: {
        id: 283,
        product_id: 87,
        src: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
    },
    {
      id: 88,
      title: "Backpack Waterproof",
      variants: [
        { id: 88, product_id: 88, title: "Gray / 20L", price: "75" },
        { id: 89, product_id: 88, title: "Gray / 30L", price: "85" },
        { id: 90, product_id: 88, title: "Navy / 20L", price: "75" },
        { id: 91, product_id: 88, title: "Navy / 30L", price: "85" }
      ],
      image: {
        id: 284,
        product_id: 88,
        src: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
    }
  ];

  // Filter by search if provided
  let filteredProducts = allMockProducts;
  if (search.trim()) {
    const searchLower = search.toLowerCase();
    filteredProducts = allMockProducts.filter(product => 
      product.title.toLowerCase().includes(searchLower)
    );
  }

  // Implement pagination
  const start = page * limit;
  const end = start + limit;
  const paginatedProducts = filteredProducts.slice(start, end);

  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(paginatedProducts);
    }, 300);
  });
};

export { getMockProducts };