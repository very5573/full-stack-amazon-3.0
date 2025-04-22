import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';
import { useNavigate } from 'react-router-dom'; // ✅ Import this
import "../style/FashionPage.css";
import fashionImages from "../data/fashionData";

const FashionPage = ({ searchTerm }) => {
  const [sortType, setSortType] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Use it

  // Add product to cart
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  // Navigate to product detail page
  const handleProductClick = (item) => {
    console.log("Navigating to product with ID:", item.id); // ✅ Console check
    navigate(`/fashion-product/${item.id}`); // ✅ Navigate to fashion detail page
  };

  // Filter and sort logic
  let filtered = Array.isArray(fashionImages) ? fashionImages.filter((item) =>
    item.title?.toLowerCase().includes((searchTerm || '').toLowerCase())
  ) : [];

  if (sortType === "low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortType === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="fashion-page">
      <div className="sort-buttons">
        <button onClick={() => setSortType("low")}>Price: Low to High</button>
        <button onClick={() => setSortType("high")}>Price: High to Low</button>
      </div>

      <div className="fashion-product-grid">
        {filtered.map((item, idx) => (
          <div
            className="fashion-product-card"
            key={item.id || idx}
            onClick={() => handleProductClick(item)} // ✅ Navigate here
          >
            <div className="fashion-product-image-container">
              <img src={item.img} alt={item.title} />
              <div className="fashion-hover-overlay">
                <h3>{item.title}</h3>
                <p>₹{item.price}</p>
                <button
                  className="fashion-add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ So it doesn't trigger navigate
                    handleAddToCart(item);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FashionPage;
