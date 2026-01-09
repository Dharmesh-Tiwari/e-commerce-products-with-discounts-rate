import React, { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import VariantItem from './VariantItem';
import DiscountInput from '../Shared/DiscountInput';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaGripVertical, FaSave, FaTimes } from 'react-icons/fa';
import './ProductList.css';

const ItemTypes = {
  PRODUCT: 'product',
  VARIANT: 'variant'
};

const ProductItem = ({
  product,
  index,
  onMove,
  onMoveVariant,
  onRemove,
  onEdit,
  onDiscountChange,
  onToggleVariants,
  canRemove,
  onProductNameChange // Add this prop
}) => {
  const ref = useRef(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(product.title);
  
  const [, drop] = useDrop({
    accept: ItemTypes.PRODUCT,
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) return;
      
      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.PRODUCT,
    item: { type: ItemTypes.PRODUCT, id: product.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  drag(drop(ref));

  const hasMultipleVariants = product.variants.length > 1;
  const productDiscount = product.variants[0]?.discount || { type: 'none', value: 0 };

  const handleSaveName = () => {
    if (editedName.trim() && editedName !== product.title) {
      onProductNameChange(product.id, editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setEditedName(product.title);
    setIsEditingName(false);
  };

  return (
    <div
      ref={preview}
      className={`product-item ${isDragging ? 'dragging' : ''}`}
    >
      <div ref={ref} className="drag-handle">
        <FaGripVertical />
      </div>
      
      <div className="product-content">
        <div className="product-header">
          <div className="product-image">
            <img src={product.image?.src} alt={product.title} />
          </div>
          
          <div className="product-info">
            <div className="product-title-section">
              {isEditingName ? (
                <div className="product-name-edit">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="product-name-input"
                    autoFocus
                  />
                  <div className="name-edit-actions">
                    <button className="icon-btn save-btn" onClick={handleSaveName} title="Save">
                      <FaSave />
                    </button>
                    <button className="icon-btn cancel-btn" onClick={handleCancelEdit} title="Cancel">
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="product-title-display">
                  <h3 
                    className="product-title"
                    onClick={() => setIsEditingName(true)}
                    title="Click to edit product name"
                  >
                    {product.title}
                  </h3>
                  <button 
                    className="edit-name-btn"
                    onClick={() => setIsEditingName(true)}
                    title="Edit product name"
                  >
                    <FaEdit size={14} />
                  </button>
                </div>
              )}
              <p className="product-variant-count">
                {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="product-actions">
            <button className="icon-btn edit-product-btn" onClick={onEdit} title="Replace with other products">
              <FaEdit />
            </button>
            
            {hasMultipleVariants && (
              <button
                className="icon-btn toggle-btn"
                onClick={onToggleVariants}
                title={product.showVariants ? 'Hide Variants' : 'Show Variants'}
              >
                {product.showVariants ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            )}
            
            {canRemove && (
              <button className="icon-btn remove-btn" onClick={onRemove} title="Remove Product">
                <FaTrash />
              </button>
            )}
          </div>
        </div>

        <div className="discount-section">
          <label>Apply discount to all variants:</label>
          <DiscountInput
            discount={productDiscount}
            onChange={(discount) => onDiscountChange(product.id, null, discount)}
          />
        </div>

        {product.showVariants && hasMultipleVariants && (
          <div className="variants-list">
            {product.variants.map((variant, variantIndex) => (
              <VariantItem
                key={variant.id}
                variant={variant}
                index={variantIndex}
                productId={product.id}
                onMoveVariant={onMoveVariant}
                onDiscountChange={onDiscountChange}
                canDrag={product.variants.length > 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItem;