// src/components/SuccessPage.js
import React from 'react';
import '../style/successPage.css'; // Make sure you create a CSS file for success styling

const SuccessPage = () => {
  return (
    <div className="success-page">
      <h2>Order Successful!</h2>
      <p>Your order has been successfully placed. Thank you for shopping with us!</p>
      <button className="continue-shopping-btn" onClick={() => window.location.href = '/'}>Continue Shopping</button>
    </div>
  );
};

export default SuccessPage;
