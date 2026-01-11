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
    } finally {
      setLoading(false);
    }
  }, [search, page, limit]);

useEffect(() => {
  loadProducts()
}, [loadProducts])


  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return false;
    
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