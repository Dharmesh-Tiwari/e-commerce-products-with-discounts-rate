// Calculate final price after discount
export const calculateFinalPrice = (price, discount) => {
  if (!discount || discount.type === 'none') return parseFloat(price);
  
  const priceNum = parseFloat(price);
  if (discount.type === 'percentage') {
    const discounted = priceNum * (1 - discount.value / 100);
    return discounted.toFixed(2);
  } else if (discount.type === 'flat') {
    const discounted = Math.max(0, priceNum - discount.value);
    return discounted.toFixed(2);
  }
  return priceNum.toFixed(2);
};

// Format price
export const formatPrice = (price) => {
  const num = parseFloat(price);
  return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
};

// Format discount value for display
export const formatDiscountValue = (discount) => {
  if (!discount || discount.type === 'none') return '0';
  
  if (discount.type === 'percentage') {
    return discount.value.toString();
  } else {
    return discount.value.toFixed(2);
  }
};

// Get initial mock products for demo
export const getInitialProducts = () => [
  {
    id: 1,
    title: "Fog Linen Chambray Towel - Beige Stripe",
    variants: [
      {
        id: 1,
        product_id: 77,
        title: "XS / Silver",
        price: "49.00",
        discount: { type: 'none', value: 0 }
      },
      {
        id: 2,
        product_id: 77,
        title: "S / Silver",
        price: "49.00",
        discount: { type: 'percentage', value: 10 }
      },
      {
        id: 3,
        product_id: 77,
        title: "M / Silver",
        price: "49.00",
        discount: { type: 'flat', value: 5 }
      }
    ],
    image: {
      src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/77/images/266/foglinenbeigestripetowel1b.1647248662.386.513.jpg?c=1",
      alt: "Fog Linen Chambray Towel"
    },
    showVariants: false
  },
  {
    id: 2,
    title: "Orbit Terrarium - Large",
    variants: [
      {
        id: 64,
        product_id: 80,
        title: "Default Title",
        price: "109.00",
        discount: { type: 'none', value: 0 }
      }
    ],
    image: {
      src: "https://cdn11.bigcommerce.com/s-p1xcugzp89/products/80/images/272/roundterrariumlarge.1647248662.386.513.jpg?c=1",
      alt: "Orbit Terrarium"
    },
    showVariants: false
  }
];