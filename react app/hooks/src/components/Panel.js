import React from 'react';
import { Link } from 'react-router-dom';
import "../style/panel.css";

function Panel() {
  return (
    <div className="panel">
      {/* Left Side */}
      <div className="panel-left">
        <i className="fa-solid fa-bars"></i>
        <Link to="/Home">Home</Link>
      </div>

      {/* Right Side with Equal Spacing */}
      <div className="panel-right">
        <Link to="/electronics-deals">Electronics Deals</Link>
        <Link to="/mobile">Mobile Accessories</Link>
        <Link to="/laptop">Laptop Accessories</Link>
        <Link to="/fashion">Fashion</Link>
      </div>
    </div>
  );
}

export default Panel;
