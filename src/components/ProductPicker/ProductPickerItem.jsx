import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaCheck, FaSquare, FaCheckSquare } from 'react-icons/fa';
import './ProductPicker.css';

const ProductPickerItem = ({
  product,
  isSelected,
  isAlreadyInList,
  onSelect,
  getVariantSelected
}) => {
  const [showVariants, setShowVariants] = useState(false);
  const hasMultipleVariants = product.variants && product.variants.length > 1;
  const isSingleVariant = product.variants && product.variants.length === 1;
  const noVariants = !product.variants || product.variants.length === 0;

  // Calculate selected variants
  const selectedVariants = product.variants?.filter(variant =>
    getVariantSelected(product.id, variant.id)
  ) || [];
  
  const selectedVariantsCount = selectedVariants.length;
  const allVariantsSelected = selectedVariantsCount === product.variants?.length;
  const someVariantsSelected = selectedVariantsCount > 0 && !allVariantsSelected;

  // Handle product header click
  const handleProductClick = () => {
    if (isAlreadyInList) return;
    
    if (hasMultipleVariants && !showVariants) {
      setShowVariants(true);
    } else if (isSingleVariant) {
      const variant = product.variants[0];
      onSelect(product, variant.id);
    }
  };

  // Handle variant selection
  const handleVariantSelect = (variantId) => {
    onSelect(product, variantId);
  };

  // Handle select all variants
  const handleSelectAll = () => {
    product.variants.forEach(variant => {
      const isSelected = getVariantSelected(product.id, variant.id);
      if (allVariantsSelected || (!allVariantsSelected && !isSelected)) {
        handleVariantSelect(variant.id);
      }
    });
  };

  // Get price range for multiple variants
  const getPriceRange = () => {
    if (!product.variants || product.variants.length === 0) return null;
    
    const prices = product.variants.map(v => parseFloat(v.price) || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) {
      return `$${minPrice.toFixed(2)}`;
    }
    return `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
  };

  return (
    <div className={`product-picker-item ${isAlreadyInList ? 'disabled' : ''}`}>
      {/* Product Header */}
      <div 
        className="picker-item-header" 
        onClick={handleProductClick}
        style={{ cursor: isAlreadyInList ? 'not-allowed' : 'pointer' }}
      >
        <div className="picker-item-image">
          <img 
            src={product.image?.src || 'https://via.placeholder.com/80'} 
            alt={product.title || 'Product'} 
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/80';
            }}
          />
          
          {!isAlreadyInList && (allVariantsSelected || (isSingleVariant && isSelected)) && (
            <div className="selection-indicator full">
              <FaCheck />
            </div>
          )}
          
          {!isAlreadyInList && someVariantsSelected && (
            <div className="selection-indicator partial">
              <FaCheckSquare />
            </div>
          )}
        </div>
        
        <div className="picker-item-info">
          <h4 className="picker-item-title" title={product.title}>
            {product.title || 'Untitled Product'}
          </h4>
          
          <div className="variant-info">
            <span className="variant-count">
              {product.variants?.length || 0} variant{product.variants?.length !== 1 ? 's' : ''}
            </span>
            
            {selectedVariantsCount > 0 && (
              <span className="selected-count">
                ({selectedVariantsCount} selected)
              </span>
            )}
          </div>
          
          <div className="price-range">
            {getPriceRange()}
          </div>
          
          {isAlreadyInList && (
            <span className="already-in-list">Already in list</span>
          )}
        </div>
        
        {!isAlreadyInList && hasMultipleVariants && (
          <button
            className="variants-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setShowVariants(!showVariants);
            }}
            aria-label={showVariants ? 'Hide variants' : 'Show variants'}
          >
            {showVariants ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        )}
      </div>

      {/* Variants for multi-variant products */}
      {showVariants && hasMultipleVariants && !isAlreadyInList && (
        <div className="variants-selection" onClick={(e) => e.stopPropagation()}>
          <div className="variants-header">
            <div className="variants-title">
              <span>Select variants:</span>
              <span className="variants-selected-count">
                {selectedVariantsCount} of {product.variants.length} selected
              </span>
            </div>
            
            <button
              className="select-all-btn"
              onClick={handleSelectAll}
              aria-label={allVariantsSelected ? 'Deselect all' : 'Select all'}
            >
              {allVariantsSelected ? (
                <>
                  <FaCheckSquare /> Deselect All
                </>
              ) : (
                <>
                  <FaSquare /> Select All
                </>
              )}
            </button>
          </div>
          
          <div className="variants-list">
            {product.variants.map((variant) => {
              const isVariantSelected = getVariantSelected(product.id, variant.id);
              const price = parseFloat(variant.price || 0).toFixed(2);
              
              return (
                <div
                  key={`${product.id}-${variant.id}`}
                  className={`variant-option ${isVariantSelected ? 'selected' : ''}`}
                  onClick={() => handleVariantSelect(variant.id)}
                >
                  <div className="variant-checkbox">
                    {isVariantSelected ? <FaCheckSquare /> : <FaSquare />}
                  </div>
                  
                  <div className="variant-details">
                    <span className="variant-title" title={variant.title}>
                      {variant.title || 'Default Variant'}
                    </span>
                    <span className="variant-price">${price}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Single variant display */}
      {!showVariants && isSingleVariant && !isAlreadyInList && (
        <div className="single-variant-info">
          <div 
            className={`variant-option ${isSelected ? 'selected' : ''}`}
            onClick={() => handleVariantSelect(product.variants[0].id)}
          >
            <div className="variant-checkbox">
              {isSelected ? <FaCheckSquare /> : <FaSquare />}
            </div>
            
            <div className="variant-details">
              <span className="variant-title" title={product.variants[0].title}>
                {product.variants[0].title || 'Default Variant'}
              </span>
              <span className="variant-price">
                ${parseFloat(product.variants[0]?.price || 0).toFixed(2)}
              </span>
            </div>
            
            <button
              className="select-single-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleVariantSelect(product.variants[0].id);
              }}
            >
              {isSelected ? 'Deselect' : 'Select'}
            </button>
          </div>
        </div>
      )}

      {/* No variants warning */}
      {noVariants && !isAlreadyInList && (
        <div className="single-variant-info">
          <div className="variant-option" style={{ opacity: 0.6 }}>
            <div className="variant-checkbox">
              <FaSquare />
            </div>
            <div className="variant-details">
              <span className="variant-title">No variants available</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPickerItem;