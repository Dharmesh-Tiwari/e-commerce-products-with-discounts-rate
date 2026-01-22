import React, { useState, useEffect, useCallback, useRef } from 'react';
import ProductPickerItem from './ProductPickerItem';
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

  const handleSelectProduct = (product, variantId = null) => {
    setSelectedItems(prev => {
      const itemKey = variantId ? `${product.id}-${variantId}` : `${product.id}`;
      const existingIndex = prev.findIndex(item => item.key === itemKey);
      
      if (existingIndex >= 0) {
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        return [...prev, { 
          product, 
          variantId,
          key: itemKey 
        }];
      }
    });
  };

  const getVariantSelected = (productId, variantId) => {
    return selectedItems.some(item => 
      item.product.id === productId && item.variantId === variantId
    );
  };

  const isProductSelected = (product) => {
    if (!product.variants || product.variants.length === 0) return false;
    
    if (product.variants.length === 1) {
      return selectedItems.some(item => 
        item.product.id === product.id && item.variantId === product.variants[0].id
      );
    }
    
    return product.variants.some(variant =>
      selectedItems.some(item => 
        item.product.id === product.id && item.variantId === variant.id
      )
    );
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
    const productsMap = new Map();
    
    selectedItems.forEach(({ product, variantId }) => {
      if (!productsMap.has(product.id)) {
        productsMap.set(product.id, {
          ...product,
          variants: []
        });
      }
      
      const productData = productsMap.get(product.id);
      const variant = product.variants.find(v => v.id === variantId);
      if (variant) {
        productData.variants.push({
          ...variant,
          discount: { type: 'none', value: 0 }
        });
      }
    });
    
    const newProducts = Array.from(productsMap.values()).map(productData => ({
      ...productData,
      showVariants: productData.variants.length > 1
    }));
    
    onSelect(newProducts);
    onClose();
  };

  const retryApi = () => {
    refresh();
  };

  const totalSelectedCount = selectedItems.length;

  if (!isOpen) return null;

  return (
    <div className="picker-overlay">
      <div className="picker-modal">
        <div className="picker-header">
          <div style={{ flex: 1 }}>
            <h2>Select Products & Variants</h2>
          </div>
          
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
            placeholder="Search products by name..."
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
              <p>📭 No products found</p>
              {search ? (
                <p>No results for "{search}". Try a different search term.</p>
              ) : (
                <p>Start typing in the search box to find products.</p>
              )}
            </div>
          ) : (
            <>
              <div style={{ 
                marginBottom: '15px', 
                color: '#666',
                fontSize: '0.9rem'
              }}>
                Found {products.length} product{products.length !== 1 ? 's' : ''}
                {search && ` for "${search}"`}
              </div>
              
              <div className="products-grid">
                {products.map((product) => (
                  <ProductPickerItem
                    key={product.id}
                    product={product}
                    isSelected={isProductSelected(product)}
                    isAlreadyInList={isProductAlreadyInList(product.id)}
                    onSelect={handleSelectProduct}
                    getVariantSelected={getVariantSelected}
                  />
                ))}
              </div>
            </>
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
              {totalSelectedCount} item{totalSelectedCount !== 1 ? 's' : ''} selected
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
              disabled={totalSelectedCount === 0}
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