import axios from 'axios';

const API_BASE_URL = 'https://stageapi.monkcommerce.app/task/products';
const API_KEY = '72njgfa948d9aS7gs5';

// Create axios instance with API key
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

// Fallback mock data in case API fails
const mockProducts = [
  {
    id: 1,
    title: "Sports Shoes - Running",
    variants: [
      { id: 101, product_id: 1, title: "Size 8 / Black", price: "79.99" },
      { id: 102, product_id: 1, title: "Size 9 / Black", price: "79.99" },
      { id: 103, product_id: 1, title: "Size 10 / Black", price: "79.99" },
      { id: 104, product_id: 1, title: "Size 8 / White", price: "79.99" },
      { id: 105, product_id: 1, title: "Size 9 / White", price: "79.99" }
    ],
    image: {
      src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Sports Shoes"
    }
  },
  {
    id: 2,
    title: "Wireless Headphones",
    variants: [
      { id: 201, product_id: 2, title: "Black", price: "129.99" },
      { id: 202, product_id: 2, title: "White", price: "129.99" },
      { id: 203, product_id: 2, title: "Blue", price: "139.99" }
    ],
    image: {
      src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Wireless Headphones"
    }
  },
  {
    id: 3,
    title: "Leather Jacket",
    variants: [
      { id: 301, product_id: 3, title: "Small / Black", price: "199.99" },
      { id: 302, product_id: 3, title: "Medium / Black", price: "199.99" },
      { id: 303, product_id: 3, title: "Large / Black", price: "199.99" },
      { id: 304, product_id: 3, title: "Small / Brown", price: "189.99" }
    ],
    image: {
      src: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Leather Jacket"
    }
  },
  {
    id: 4,
    title: "Smart Watch Series 5",
    variants: [
      { id: 401, product_id: 4, title: "44mm / Black", price: "299.99" },
      { id: 402, product_id: 4, title: "44mm / Silver", price: "299.99" },
      { id: 403, product_id: 4, title: "40mm / Black", price: "279.99" }
    ],
    image: {
      src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Smart Watch"
    }
  },
  {
    id: 5,
    title: "Backpack - Waterproof",
    variants: [
      { id: 501, product_id: 5, title: "30L / Gray", price: "89.99" },
      { id: 502, product_id: 5, title: "30L / Navy", price: "89.99" },
      { id: 503, product_id: 5, title: "40L / Gray", price: "99.99" }
    ],
    image: {
      src: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      alt: "Backpack"
    }
  }
];

// Helper function for mock data fallback
const getMockProducts = ({ search = '', page = 0, limit = 10 }) => {
  // Simulate network delay
  return new Promise(resolve => {
    setTimeout(() => {
      // Filter by search term
      let filteredProducts = mockProducts;
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        filteredProducts = mockProducts.filter(product =>
          product.title.toLowerCase().includes(searchLower)
        );
      }
      
      // Implement pagination
      const start = page * limit;
      const end = start + limit;
      const paginatedProducts = filteredProducts.slice(start, end);
      
      resolve(paginatedProducts);
    }, 500);
  });
};

// Main API function
export const fetchProducts = async ({ search = '', page = 0, limit = 10 }) => {
  try {
    console.log(' API Call:', { search, page, limit });
    
    const response = await api.get('/search', {
      params: {
        search: search || '',
        page: page,
        limit: limit
      }
    });
    
    console.log(' API Response Status:', response.status);
    console.log(' API Response Data:', response.data);
    
    if (!response.data) {
      throw new Error('No data received from API');
    }
    
    // Format the data properly
    const formattedData = response.data.map(product => ({
      id: product.id,
      title: product.title || 'Untitled Product',
      variants: product.variants?.map(variant => ({
        id: variant.id,
        product_id: variant.product_id,
        title: variant.title || 'Default Variant',
        price: variant.price || '0.00'
      })) || [{ id: Date.now(), product_id: product.id, title: 'Default', price: '0.00' }],
      image: product.image || {
        src: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        alt: 'Product Image'
      }
    }));
    
    return formattedData;
    
  } catch (error) {
    console.error(' API Error Details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    // Check for specific errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn('API Authentication failed, using mock data');
      return await getMockProducts({ search, page, limit });
    } else if (error.response?.status === 404) {
      console.warn(' API endpoint not found, using mock data');
      return await getMockProducts({ search, page, limit });
    } else if (error.code === 'ECONNABORTED') {
      console.warn(' Request timeout, using mock data');
      return await getMockProducts({ search, page, limit });
    } else if (!navigator.onLine) {
      console.warn(' No internet connection, using mock data');
      return await getMockProducts({ search, page, limit });
    } else {
      console.warn(' API failed, using mock data:', error.message);
      return await getMockProducts({ search, page, limit });
    }
  }
};

// Test API connection
export const testApiConnection = async () => {
  try {
    console.log('🔄 Testing API connection...');
    const response = await api.get('/search', {
      params: { search: '', page: 0, limit: 1 }
    });
    
    console.log('✅ API Test Success:', response.status);
    return {
      success: true,
      status: response.status,
      data: response.data,
      message: 'API connected successfully'
    };
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    return {
      success: false,
      error: error.message,
      status: error.response?.status,
      message: `API connection failed: ${error.message}`
    };
  }
};

// Direct API test function (for debugging)
export const directApiTest = async () => {
  console.log('🔍 Direct API Test...');
  
  try {
    // Method 1: Using fetch
    const fetchResponse = await fetch('https://stageapi.monkcommerce.app/task/products/search?search=Hat&page=0&limit=2', {
      headers: {
        'x-api-key': API_KEY
      }
    });
    
    console.log('Fetch Status:', fetchResponse.status);
    const fetchData = await fetchResponse.json();
    console.log('Fetch Data:', fetchData);
    
    // Method 2: Using axios
    const axiosResponse = await api.get('/search', {
      params: { search: 'Hat', page: 0, limit: 2 }
    });
    
    console.log('Axios Status:', axiosResponse.status);
    console.log('Axios Data:', axiosResponse.data);
    
    return {
      fetch: { status: fetchResponse.status, data: fetchData },
      axios: { status: axiosResponse.status, data: axiosResponse.data }
    };
  } catch (err) {
    console.error('Direct API Test Error:', err);
    throw err;
  }
};