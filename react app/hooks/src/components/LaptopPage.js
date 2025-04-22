import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';
import { useNavigate } from 'react-router-dom'; // ✅ Import this
import "../style/LaptopPage.css";
import laptopImages from "../data/laptopData";

const LaptopPage = ({ searchTerm }) => {
  const [sortType, setSortType] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ Use it

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleProductClick = (item) => {
    console.log("Navigating to product with ID:", item.id); // ✅ Console check
    navigate(`/product/${item.id}`); // ✅ Navigate to detail page
  };

  // Filter and sort logic
  let filtered = Array.isArray(laptopImages) ? laptopImages.filter((item) =>
    item.title?.toLowerCase().includes((searchTerm || '').toLowerCase())
  ) : [];

  if (sortType === "low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortType === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="laptop-page">
      <div className="sort-buttons">
        <button onClick={() => setSortType("low")}>Price: Low to High</button>
        <button onClick={() => setSortType("high")}>Price: High to Low</button>
      </div>

      <div className="laptop-product-grid">
        {filtered.map((item, idx) => (
          <div
            className="laptop-product-card"
            key={item.id || idx}
            onClick={() => handleProductClick(item)} // ✅ Navigate here
          >
            <div className="laptop-product-image-container">
              <img src={item.img} alt={item.title} />
              <div className="laptop-hover-overlay">
                <h3>{item.title}</h3>
                <p>₹{item.price}</p>
                <button
                  className="laptop-add-to-cart-btn"
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

export default LaptopPage;
