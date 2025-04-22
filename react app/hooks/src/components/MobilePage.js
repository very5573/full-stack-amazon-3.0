import React, { useState } from 'react';
import "../style/MobilePage.css";  // Importing the CSS for MobilePage styling
import mobileImages from "../data/mobileData";  // Import mobile data (array with {img, title, price})
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';  // Redux action to add items to the cart

const MobilePage = ({ searchTerm }) => {
  const [sortType, setSortType] = useState("");  // State for sorting by price
  const dispatch = useDispatch();  // Dispatch function from Redux

  // Filter mobiles based on the search term
  let filtered = mobileImages.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())  // Case insensitive search
  );

  // Sorting logic based on price
  if (sortType === "low") {
    filtered.sort((a, b) => a.price - b.price);  // Sorting from low to high price
  } else if (sortType === "high") {
    filtered.sort((a, b) => b.price - a.price);  // Sorting from high to low price
  }

  // Function to add the selected product to the cart
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));  // Dispatch the addToCart action
  };

  return (
    <div className="mobile-page">
      {/* Sorting Buttons */}
      <div className="sort-buttons">
        <button onClick={() => setSortType("low")}>Price: Low to High</button>
        <button onClick={() => setSortType("high")}>Price: High to Low</button>
      </div>

      {/* Grid of mobile products */}
      <div className="mobile-product-grid">
        {filtered.map((item, idx) => (
          <div className="mobile-product-card" key={idx}>
            <div className="mobile-product-image-container">
              <img src={item.img} alt={item.title} />
              <div className="mobile-hover-overlay">
                <h3>{item.title}</h3>
                <p>₹{item.price}</p>
                <button 
                  className="mobile-add-to-cart-btn"
                  onClick={() => handleAddToCart(item)}
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

export default MobilePage;
