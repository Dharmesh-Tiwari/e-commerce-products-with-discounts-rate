import React from 'react';
import ProductItem from './ProductItem';
import './ProductList.css';

const ProductList = ({
  products,
  onMoveProduct,
  onMoveVariant,
  onRemoveProduct,
  onEditProduct,
  onDiscountChange,
  onToggleVariants,
  onProductNameChange
}) => {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>No products added yet. Click "Add Product" to get started!</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      {products.map((product, index) => (
        <ProductItem
          key={product.id}
          index={index}
          product={product}
          onMove={onMoveProduct}
          onMoveVariant={onMoveVariant}
          onRemove={() => onRemoveProduct(product.id)}
          onEdit={() => onEditProduct(product.id)}
          onDiscountChange={onDiscountChange}
          onToggleVariants={() => onToggleVariants(product.id)}
          canRemove={products.length > 1}
           onProductNameChange={onProductNameChange}
        />
      ))}
    </div>
  );
};

export default ProductList; // Make sure this is default export