import React, { useState, useEffect, useCallback, useRef } from 'react';
import useProducts from '../../hooks/useProducts';
import useDebounce from '../../hooks/useDebounce';
import { FaSearch, FaTimes, FaCheck, FaExclamationTriangle, FaSync, FaDatabase } from 'react-icons/fa';
import './ProductPicker.css';

const ProductPicker = ({ isOpen, onClose, onSelect, selectedProducts, editingProductId }) => {
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const debouncedSearch = useDebounce(search, 500);
  
  const { products, loading, error, apiStatus, loadMore, hasMore, refresh } = useProducts({
    search: debouncedSearch,
    page: 0,
    limit: 10
  });

  const containerRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedItems([]);
    }
  }, [isOpen]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || loading || isLoadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      setIsLoadingMore(true);
      loadMore().finally(() => {
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

  const handleSelectProduct = (product) => {
    setSelectedItems(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const isProductSelected = (productId) => {
    return selectedItems.some(item => item.id === productId);
  };

  const isProductAlreadyInList = (productId) => {
    if (editingProductId) {
      return selectedProducts
        .filter(p => p.id !== editingProductId)
        .some(p => p.id === productId);
    }
    return selectedProducts.some(p => p.id === productId);
  };

  const handleConfirmSelection = () => {
    const newProducts = selectedItems.map(product => ({
      ...product,
      variants: product.variants.map(v => ({
        ...v,
        discount: { type: 'none', value: 0 }
      })),
      showVariants: product.variants.length > 1
    }));
    
    onSelect(newProducts);
    onClose();
  };

  const retryApi = () => {
    refresh();
  };

  if (!isOpen) return null;

  return (
    <div className="picker-overlay">
      <div className="picker-modal">
        <div className="picker-header">
          <h2>Select Products</h2>
          <div className="api-status-indicator">
            {apiStatus === 'checking' && (
              <span className="api-status checking">
                <FaSync className="spinning" /> Connecting...
              </span>
            )}
            {apiStatus === 'connected' && (
              <span className="api-status connected">
                <FaCheck /> API Connected
              </span>
            )}
            {apiStatus === 'failed' && (
              <span className="api-status failed">
                <FaDatabase /> Using Demo Data
              </span>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="picker-search">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products (e.g., Hat, Shoes, Watch)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div ref={containerRef} className="picker-content">
          {loading && !isLoadingMore ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : apiStatus === 'failed' ? (
            <div className="api-notice">
              <FaDatabase className="notice-icon" />
              <h3>Using Demo Products</h3>
              <p>The API connection failed. Showing demo products instead.</p>
              <button className="retry-btn" onClick={retryApi}>
                <FaSync /> Retry API Connection
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No products found</p>
              {search && <p>Try searching for: Hat, Shoes, Watch</p>}
              {!search && <p>Try typing in the search box above</p>}
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => {
                const isSelected = isProductSelected(product.id);
                const isAlreadyInList = isProductAlreadyInList(product.id);
                
                return (
                  <div
                    key={product.id}
                    className={`product-picker-item ${isAlreadyInList ? 'disabled' : ''}`}
                    onClick={() => !isAlreadyInList && handleSelectProduct(product)}
                    style={{
                      opacity: isAlreadyInList ? 0.6 : 1,
                      cursor: isAlreadyInList ? 'not-allowed' : 'pointer',
                      borderColor: isSelected ? '#28a745' : '#e0e0e0',
                      borderWidth: isSelected ? '2px' : '1px'
                    }}
                  >
                    <div className="picker-item-header">
                      <div className="picker-item-image">
                        <img src={product.image.src} alt={product.title} />
                      </div>
                      
                      <div className="picker-item-info">
                        <h4 className="picker-item-title">{product.title}</h4>
                        <p className="picker-item-variants">
                          {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                        </p>
                        
                        {isAlreadyInList ? (
                          <span className="already-in-list">Already in list</span>
                        ) : isSelected ? (
                          <span className="selection-indicator">Selected</span>
                        ) : null}
                      </div>
                    </div>
                    
                    <div className="product-price">
                      From ${product.variants[0]?.price || '0.00'}
                    </div>
                    
                    {apiStatus === 'failed' && (
                      <div className="demo-badge">
                        <FaDatabase /> Demo Product
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          
          {isLoadingMore && (
            <div className="loading-more">
              <div className="spinner small"></div>
              <p>Loading more products...</p>
            </div>
          )}
        </div>

        <div className="picker-footer">
          <div className="selection-info">
            <div className="selection-count">
              {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
            </div>
            <div className="data-source">
              {apiStatus === 'connected' ? 'Live API Data' : 'Demo Data'}
            </div>
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
              <FaCheck /> Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPicker;