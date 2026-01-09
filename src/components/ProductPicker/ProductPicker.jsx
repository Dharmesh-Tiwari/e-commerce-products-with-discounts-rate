import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProductPickerItem from './ProductPickerItem';
import useProducts from '../../hooks/useProducts';
import useDebounce from '../../hooks/useDebounce';
import { FaSearch, FaTimes, FaCheck } from 'react-icons/fa';
import './ProductPicker.css';

const ProductPicker = ({ isOpen, onClose, onSelect, selectedProducts, editingProductId }) => {
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  
  const { products, loading, error, loadMore } = useProducts({
    search: debouncedSearch,
    page
  });

  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedItems([]);
      setSearch('');
      setPage(0);
    }
  }, [isOpen]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || loading || isLoadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setIsLoadingMore(true);
      loadMore().then((hasMoreData) => {
        setHasMore(hasMoreData);
        setPage(prev => prev + 1);
        setIsLoadingMore(false);
      });
    }
  }, [loading, isLoadingMore, hasMore, loadMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const handleSelectProduct = (product, variantId = null) => {
    setSelectedItems(prev => {
      const existingIndex = prev.findIndex(item => 
        item.product.id === product.id && item.variantId === variantId
      );
      
      if (existingIndex >= 0) {
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        return [...prev, { product, variantId }];
      }
    });
  };

  const isProductSelected = (product, variantId = null) => {
    return selectedItems.some(item => 
      item.product.id === product.id && item.variantId === variantId
    );
  };

  const isProductAlreadyInList = (productId) => {
    if (editingProductId) {
      // When editing, exclude the product being replaced
      return selectedProducts
        .filter(p => p.id !== editingProductId)
        .some(p => p.id === productId);
    }
    return selectedProducts.some(p => p.id === productId);
  };

  const handleConfirmSelection = () => {
    const newProducts = selectedItems.map(({ product, variantId }) => {
      if (variantId) {
        // Create a new product with only the selected variant
        const variant = product.variants.find(v => v.id === variantId);
        return {
          ...product,
          variants: [variant],
          showVariants: false
        };
      } else {
        // Use all variants
        return {
          ...product,
          variants: product.variants.map(v => ({
            ...v,
            discount: { type: 'none', value: 0 }
          })),
          showVariants: product.variants.length > 1
        };
      }
    });
    
    onSelect(newProducts);
  };

  if (!isOpen) return null;

  return (
    <div className="picker-overlay">
      <div className="picker-modal">
        <div className="picker-header">
          <h2>Select Products</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="picker-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        {error && <div className="error">{error}</div>}

        <div ref={containerRef} className="picker-content">
          {loading && !isLoadingMore ? (
            <div className="loading">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="empty-state">No products found</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductPickerItem
                  key={product.id}
                  product={product}
                  isSelected={isProductSelected(product)}
                  isAlreadyInList={isProductAlreadyInList(product.id)}
                  onSelect={handleSelectProduct}
                  onSelectVariant={handleSelectProduct}
                  getVariantSelected={isProductSelected}
                />
              ))}
            </div>
          )}
          
          {isLoadingMore && (
            <div className="loading-more">Loading more products...</div>
          )}
        </div>

        <div className="picker-footer">
          <div className="selection-count">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </div>
          <div className="footer-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button
              className="confirm-btn"
              onClick={handleConfirmSelection}
              disabled={selectedItems.length === 0}
            >
              <FaCheck /> Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPicker;