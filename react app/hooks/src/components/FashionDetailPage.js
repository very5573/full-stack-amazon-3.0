import React from 'react';
import { useParams } from 'react-router-dom';
import fashionData from '../data/fashionData'; // Import the fashion data
import "../style/FashionDetailPage.css";
const FashionDetailPage = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const product = fashionData.find(item => item.id === parseInt(id)); // Find the product by ID

  if (!product) {
    return <div>Product not found</div>; // Handle case where product is not found
  }

  return (
    <div className="fashion-detail-page">
      <div className="fashion-detail-container">
        <div className="fashion-detail-image">
          <img src={product.img} alt={product.title} />
        </div>
        <div className="fashion-detail-info">
          <h2>{product.title}</h2>
          <p className="price">₹{product.price}</p>
          <p className="description">{product.description}</p>
          
          <div className="details">
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Material:</strong> {product.material}</p>
            <p><strong>Occasion:</strong> {product.occasion}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionDetailPage;
