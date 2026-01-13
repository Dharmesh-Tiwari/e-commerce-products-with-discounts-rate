import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, testApiConnection } from '../utils/api';

const useProducts = ({ search = '', page = 0, limit = 10 } = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking');

  // Test API connection on mount
  useEffect(() => {
    const testConnection = async () => {
      console.log('🔄 Testing API connection...');
      const result = await testApiConnection();
      console.log('📊 API Test Result:', result);
      setApiStatus(result.success ? 'connected' : 'failed');
    };
    testConnection();
  }, []);

  const loadProducts = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('📥 Loading products...');
      
      const data = await fetchProducts({
        search,
        page: reset ? 0 : page,
        limit
      });

      console.log('✅ Products loaded:', data.length, 'items');
      console.log('📝 Sample product:', data[0]);

      if (reset) {
        setProducts(data);
        setHasMore(data.length === limit);
      } else {
        setProducts(prev => [...prev, ...data]);
        setHasMore(data.length === limit);
      }
      
      setApiStatus('connected');
      
    } catch (err) {
      console.error('❌ Error loading products:', err);
      setError(err.message);
      setApiStatus('failed');
      
      // Even on error, try to show mock data
      if (reset) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  }, [search, page, limit]);

  // Load products when search changes
  useEffect(() => {
    console.log('🔍 Search changed:', search);
    loadProducts(true);
  }, [search, loadProducts]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return false;
    
    try {
      const nextPage = page + 1;
      console.log('⬇️ Loading more products, page:', nextPage);
      
      const data = await fetchProducts({
        search,
        page: nextPage,
        limit
      });
      
      setProducts(prev => [...prev, ...data]);
      const hasMoreData = data.length === limit;
      setHasMore(hasMoreData);
      
      return hasMoreData;
    } catch (err) {
      console.error('❌ Error loading more products:', err);
      setError(err.message);
      return false;
    }
  }, [search, page, limit, hasMore, loading]);

  return {
    products,
    loading,
    error,
    hasMore,
    apiStatus,
    loadProducts,
    loadMore,
    refresh: () => loadProducts(true)
  };
};

export default useProducts;