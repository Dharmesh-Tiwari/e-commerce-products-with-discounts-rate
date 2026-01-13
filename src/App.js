import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ProductList from './components/ProductList';
import ProductPicker from './components/ProductPicker';
import { getInitialProducts } from './utils/helpers';
import './App.css';

function App() {
  const [selectedProducts, setSelectedProducts] = useState(getInitialProducts());
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [pickerKey, setPickerKey] = useState(0);

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(),
      title: `New Product ${selectedProducts.length + 1}`,
      variants: [
        {
          id: Date.now() + 1,
          product_id: Date.now(),
          title: 'Default Variant',
          price: '0.00',
          discount: { type: 'none', value: 0 }
        }
      ],
      image: {
        src: 'https://via.placeholder.com/150',
        alt: 'New Product'
      },
      showVariants: false
    };
    setSelectedProducts([...selectedProducts, newProduct]);
  };

  const handleRemoveProduct = (productId) => {
    if (selectedProducts.length > 1) {
      setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    }
  };

  const handleEditProduct = (productId) => {
    setEditingProductId(productId);
    setIsPickerOpen(true);
    setPickerKey(prev => prev + 1);
  };

  const handlePickerClose = () => {
    setIsPickerOpen(false);
    setEditingProductId(null);
  };

const handleProductSelect = useCallback((selectedProductsFromPicker) => {
  if (editingProductId) {
    
    const index = selectedProducts.findIndex(p => p.id === editingProductId);
    const newProducts = [...selectedProducts];
    
    // Remove the old product
    newProducts.splice(index, 1);
    
    // Add new products at the same position
    newProducts.splice(index, 0, ...selectedProductsFromPicker);
    
    setSelectedProducts(newProducts);
  } else {
    //  (for future expansion)
    setSelectedProducts([...selectedProducts, ...selectedProductsFromPicker]);
  }
  handlePickerClose();
}, [editingProductId, selectedProducts]);

  const handleMoveProduct = useCallback((dragIndex, hoverIndex) => {
    const dragProduct = selectedProducts[dragIndex];
    const newProducts = [...selectedProducts];
    newProducts.splice(dragIndex, 1);
    newProducts.splice(hoverIndex, 0, dragProduct);
    setSelectedProducts(newProducts);
  }, [selectedProducts]);

  const handleVariantMove = useCallback((productId, dragIndex, hoverIndex) => {
    const productIndex = selectedProducts.findIndex(p => p.id === productId);
    if (productIndex === -1) return;

    const updatedProducts = [...selectedProducts];
    const variants = [...updatedProducts[productIndex].variants];
    const dragVariant = variants[dragIndex];
    
    variants.splice(dragIndex, 1);
    variants.splice(hoverIndex, 0, dragVariant);
    
    updatedProducts[productIndex] = {
      ...updatedProducts[productIndex],
      variants
    };
    
    setSelectedProducts(updatedProducts);
  }, [selectedProducts]);

  const handleDiscountChange = useCallback((productId, variantId, discount) => {
    const productIndex = selectedProducts.findIndex(p => p.id === productId);
    if (productIndex === -1) return;

    const updatedProducts = [...selectedProducts];
    const updatedProduct = { ...updatedProducts[productIndex] };
    
    if (variantId) {
      // Update variant discount
      updatedProduct.variants = updatedProduct.variants.map(variant =>
        variant.id === variantId ? { ...variant, discount } : variant
      );
    } else {
      // Update product discount for all variants
      updatedProduct.variants = updatedProduct.variants.map(variant => ({
        ...variant,
        discount
      }));
    }
    
    updatedProducts[productIndex] = updatedProduct;
    setSelectedProducts(updatedProducts);
  }, [selectedProducts]);

  const handleToggleVariants = useCallback((productId) => {
    const updatedProducts = selectedProducts.map(product =>
      product.id === productId
        ? { ...product, showVariants: !product.showVariants }
        : product
    );
    setSelectedProducts(updatedProducts);
  }, [selectedProducts]);


  const handleProductNameChange = useCallback((productId, newName) => {
    setSelectedProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, title: newName }
          : product
      )
    );
  }, []);
  

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <header className="app-header">
          <h1>Product Manager</h1>
          <p>Manage your e-commerce products and variants</p>
        </header>
        
        <main className="app-main">
          <ProductList
            products={selectedProducts}
            onMoveProduct={handleMoveProduct}
            onMoveVariant={handleVariantMove}
            onRemoveProduct={handleRemoveProduct}
            onEditProduct={handleEditProduct}
            onDiscountChange={handleDiscountChange}
            onToggleVariants={handleToggleVariants}
             onProductNameChange={handleProductNameChange}
          />
          
          <div className="add-product-section">
            <button 
              className="add-product-btn"
              onClick={handleAddProduct}
            >
              <span className="plus-icon">+</span>
              Add Product
            </button>
          </div>
        </main>

        {isPickerOpen && (
          <ProductPicker
            key={pickerKey}
            isOpen={isPickerOpen}
            onClose={handlePickerClose}
            onSelect={handleProductSelect}
            selectedProducts={selectedProducts}
            editingProductId={editingProductId}
          />
        )}
      </div>
    </DndProvider>
  );
}

export default App;