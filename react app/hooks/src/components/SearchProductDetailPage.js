import React from 'react';
import { useParams } from 'react-router-dom';
import allProducts from '../data/allProducts';
import "../style/SearchProductDetailPage.css";
const SearchProductDetailPage = () => {
  const { id, type } = useParams();

  // 👉 YAHI pe console likh:
  console.log("🟡 Route Params:", { id, type });

  const product = allProducts.find(
    (item) =>
      parseInt(item.id) === parseInt(id) &&
      item.type?.toLowerCase() === type?.toLowerCase()
  );

  console.log("🟢 Found Product:", product); // Yahi pe check karo

  if (!product) {
    return <div>❌ Product not found</div>;
  }

  return (
    <div className="product-detail-page">
      <h2>{product.title}</h2>
      <p>₹{product.price}</p>
      <img src={product.img} alt={product.title} />
    </div>
  );
};

export default SearchProductDetailPage;
