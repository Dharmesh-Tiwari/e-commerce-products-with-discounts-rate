import React, { useState } from 'react';
import { FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './ProductPicker.css';

const ProductPickerItem = ({
  product,
  isSelected,
  isAlreadyInList,
  onSelect,
  onSelectVariant,
  getVariantSelected
}) => {
  const [showVariants, setShowVariants] = useState(false);
  const hasMultipleVariants = product.variants.length > 1;

  const handleSelect = () => {
    if (isAlreadyInList) return;
    if (hasMultipleVariants && !showVariants) {
      setShowVariants(true);
    } else {
      onSelect(product);
    }
  };

  const handleVariantSelect = (variantId) => {
    onSelectVariant(product, variantId);
  };

  const allVariantsSelected = product.variants.every(variant =>
    getVariantSelected(product, variant.id)
  );


  return (
    <div className={`product-picker-item ${isAlreadyInList ? 'disabled' : ''}`}>
      <div className="picker-item-header" onClick={handleSelect}>
        <div className="picker-item-image">
          <img src={product.image?.src} alt={product.title} />
          {(isSelected || allVariantsSelected) && !isAlreadyInList && (
            <div className="selection-indicator">
              <FaCheck />
            </div>
          )}
        </div>
        
        <div className="picker-item-info">
          <h4 className="picker-item-title">{product.title}</h4>
          <p className="picker-item-variants">
            {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
          </p>
          {isAlreadyInList && (
            <span className="already-in-list">Already in list</span>
          )}
        </div>
        
        {hasMultipleVariants && !isAlreadyInList && (
          <button
            className="variants-toggle"
            onClick={(e) => {
              e.stopPropagation();
              setShowVariants(!showVariants);
            }}
          >
            {showVariants ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        )}
      </div>

      {showVariants && hasMultipleVariants && !isAlreadyInList && (
        <div className="variants-selection">
          <div className="variants-header">
            <span>Select variants:</span>
            <button
              className="select-all-btn"
              onClick={() => {
                if (allVariantsSelected) {
                  // Deselect all
                  product.variants.forEach(variant => {
                    handleVariantSelect(variant.id);
                  });
                } else {
                  // Select all
                  product.variants.forEach(variant => {
                    if (!getVariantSelected(product, variant.id)) {
                      handleVariantSelect(variant.id);
                    }
                  });
                }
              }}
            >
              {allVariantsSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          
          <div className="variants-list">
            {product.variants.map((variant) => {
              const isVariantSelected = getVariantSelected(product, variant.id);
              return (
                <div
                  key={variant.id}
                  className={`variant-option ${isVariantSelected ? 'selected' : ''}`}
                  onClick={() => handleVariantSelect(variant.id)}
                >
                  <div className="variant-checkbox">
                    {isVariantSelected && <FaCheck />}
                  </div>
                  <span className="variant-title">{variant.title}</span>
                  <span className="variant-price">${variant.price}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPickerItem;