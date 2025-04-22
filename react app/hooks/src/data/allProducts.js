// data/allProducts.js
import fashionData from './fashionData';
import mobileData from './mobileData';
import laptopData from './laptopData';
import electronicsData from './electronicsData'; // Add electronicsData import

const allProducts = [
  ...fashionData.map((item) => ({ ...item, type: 'fashion' })),
  ...mobileData.map((item) => ({ ...item, type: 'mobile' })),
  ...laptopData.map((item) => ({ ...item, type: 'laptop' })),
  ...electronicsData.map((item) => ({ ...item, type: 'electronics' })), // Add electronics data
];

export default allProducts;
