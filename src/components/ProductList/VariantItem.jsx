import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import DiscountInput from '../Shared/DiscountInput';
import { FaGripVertical } from 'react-icons/fa';
import './ProductList.css';

const ItemTypes = {
  VARIANT: 'variant'
};

const VariantItem = ({
  variant,
  index,
  productId,
  onMoveVariant,
  onDiscountChange,
  canDrag
}) => {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemTypes.VARIANT,
    hover(item, monitor) {
      if (!ref.current) return;
      if (item.productId !== productId) return;
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) return;
      
      onMoveVariant(productId, dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.VARIANT,
    item: { type: ItemTypes.VARIANT, id: variant.id, productId, index },
    canDrag: () => canDrag,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  if (canDrag) {
    drag(drop(ref));
  }

  const finalPrice = calculateFinalPrice(variant.price, variant.discount);

  return (
    <div ref={ref} className={`variant-item ${isDragging ? 'dragging' : ''}`}>
      {canDrag && (
        <div className="variant-drag-handle">
          <FaGripVertical />
        </div>
      )}
      
      <div className="variant-content">
        <div className="variant-info">
          <span className="variant-title">{variant.title}</span>
          <div className="variant-price">
            <span className="original-price">${variant.price}</span>
            {variant.discount && variant.discount.type !== 'none' && (
              <span className="final-price">→ ${finalPrice}</span>
            )}
          </div>
        </div>
        
        <div className="variant-discount">
          <DiscountInput
            discount={variant.discount || { type: 'none', value: 0 }}
            onChange={(discount) => onDiscountChange(productId, variant.id, discount)}
          />
        </div>
      </div>
    </div>
  );
};

const calculateFinalPrice = (price, discount) => {
  if (!discount || discount.type === 'none') return price;
  
  const priceNum = parseFloat(price);
  if (discount.type === 'percentage') {
    return (priceNum * (1 - discount.value / 100)).toFixed(2);
  } else if (discount.type === 'flat') {
    return Math.max(0, priceNum - discount.value).toFixed(2);
  }
  return price;
};

export default VariantItem;