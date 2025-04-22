// pages/RegistrationSuccessPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../style/registrationSuccess.css';  // Updated CSS file

const RegistrationSuccessPage = () => {
  return (
    <div className="success-container">
      <h2>Registration Successful!</h2>
      <p>Your account has been created successfully.</p>
      <Link to="/">Go to Home</Link>
    </div>
  );
};

export default RegistrationSuccessPage;
