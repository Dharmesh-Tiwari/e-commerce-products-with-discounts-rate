import { useState, useEffect, useCallback } from 'react';
import { fetchProducts } from '../utils/api';

const useProducts = ({ search = '', page = 0, limit = 10 } = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const loadProducts = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchProducts({
        search,
        page: reset ? 0 : page,
        limit
      });

      if (reset) {
        setProducts(data);
        setHasMore(data.length === limit);
      } else {
        setProducts(prev => [...prev, ...data]);
        setHasMore(data.length === limit);
      }
    } catch (err) {
      setError(err.message || 'Failed to load products');
      console.error('Error loading products:', err);
      // Don't clear products on error, keep showing existing ones
    } finally {
      setLoading(false);
    }
  }, [search, page, limit]);

  useEffect(() => {
    setProducts([]);
    setHasMore(true);
    loadProducts(true);
  }, [search, limit, loadProducts]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return false;
    
    try {
      const nextPage = page + 1;
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
      console.error('Error loading more products:', err);
      return false;
    }
  }, [search, page, limit, hasMore, loading]);

  return {
    products,
    loading,
    error,
    hasMore,
    loadProducts,
    loadMore
  };
};

export default useProducts;