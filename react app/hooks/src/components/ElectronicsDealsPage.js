import React, { useState } from 'react';
import "../style/ElectronicsDealsPage.css";
import electronicsImages from "../data/electronicsData";

// Redux
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';

const ElectronicsDealsPage = ({ searchTerm }) => {
  const [sortType, setSortType] = useState("");
  const dispatch = useDispatch();

  // Filter aur sorting
  let filtered = electronicsImages.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (sortType === "low") filtered.sort((a, b) => a.price - b.price);
  if (sortType === "high") filtered.sort((a, b) => b.price - a.price);

  // Add to cart function
  const handleAddToCart = (product) => {
    // Yahan product mein unique id hona chahiye, jaise product.id
    dispatch(addToCart(product));
  };

  return (
    <div className="product-page">
      <div className="sort-buttons">
        <button onClick={() => setSortType("low")}>Price: Low to High</button>
        <button onClick={() => setSortType("high")}>Price: High to Low</button>
      </div>

      <div className="product-grid">
        {filtered.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.img} alt={product.title} />
            <h3>{product.title}</h3>
            <p>₹{product.price}</p>
            <button
              className="add-to-cart-btn"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElectronicsDealsPage;