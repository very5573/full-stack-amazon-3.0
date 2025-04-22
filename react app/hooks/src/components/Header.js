import React, { useState, useEffect } from 'react';
import '../style/header.css';
import { FaLocationDot, FaMagnifyingGlass, FaCartShopping } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import allProducts from '../data/allProducts';

function Header({ searchTerm, onSearch }) {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All'); // Default to "All" category
  const navigate = useNavigate();

  // Update suggestions based on search term and category
  useEffect(() => {
    if (localSearch.trim() === '') {
      setSuggestions([]);
      return;
    }

    const filtered = allProducts.filter(item =>
      item.title.toLowerCase().includes(localSearch.toLowerCase()) &&
      (selectedCategory === 'All' || item.type.toLowerCase() === selectedCategory.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5)); // Limit suggestions to 5 items
  }, [localSearch, selectedCategory]);

  // Handle search input change
  const handleInputChange = (e) => {
    setLocalSearch(e.target.value);
    onSearch(e); // Still update App.js searchTerm
  };

  // Handle clicking on a suggestion
  const handleSuggestionClick = (title) => {
    setLocalSearch(title);
    setSuggestions([]);
    navigate(`/search-results?query=${title}&category=${selectedCategory}`);
  };

  // Handle the search button click
  const handleSearchClick = () => {
    if (localSearch.trim() !== '') {
      navigate(`/search-results?query=${localSearch}&category=${selectedCategory}`);
    }
  };

  return (
    <div className="navbar">
      <div className="nav-logo border">
        <div className="logo"></div>
      </div>

      <div className="nav-address border">
        <p className="add-first">Deliver to</p>
        <div className="add-icon">
          <FaLocationDot />
          <p className="add-second">India</p>
        </div>
      </div>

      <div className="nav-search">
        {/* Category Dropdown */}
        <select
          className="search-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Mobile">Mobile</option>
          <option value="Laptop">Laptop</option>
          <option value="Fashion">Fashion</option>
          <option value="Electronics">Electronics</option>
        </select>

        {/* Search Input */}
        <input
          placeholder="Search Amazon"
          className="search-input"
          value={localSearch}
          onChange={handleInputChange}
        />

        {/* Search Icon */}
        <div className="search-icon" onClick={handleSearchClick}>
          <FaMagnifyingGlass />
        </div>

        {/* Suggestions Box */}
        {suggestions.length > 0 && (
          <ul className="suggestion-box">
            {suggestions.map((item) => (
              <li
                key={item.id}
                onClick={() => handleSuggestionClick(item.title)}
              >
                {item.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="nav-signin">
        <Link to="/register" style={{ textDecoration: 'none', color: 'white' }}>
          <p><span>Hello, sign in</span></p>
          <p className="nav-second">Account & Lists</p>
        </Link>
      </div>

      <div className="nav-return">
        <p><span>Returns</span></p>
        <p className="nav-second">& Orders</p>
      </div>

      <div className="nav-cart border">
        <Link to="/cart">
          <FaCartShopping />
          <span>Cart</span>
        </Link>
      </div>
    </div>
  );
}

export default Header;
