import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import your components
import Header from './components/Header';
import Panel from './components/Panel';
import MobilePage from './components/MobilePage';
import LaptopPage from './components/LaptopPage';
import FashionPage from './components/FashionPage';
import ElectronicsDealsPage from './components/ElectronicsDealsPage';
import Home from './components/Home';
import CartPage from './pages/CartPage';
import SuccessPage from './pages/SuccessPage';
import ProductDetailPage from './components/ProductDetailPage';
import RegisterPage from './components/RegisterPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import SearchResultsPage from './components/SearchResultsPage';
import SearchProductDetailPage from './components/SearchProductDetailPage';
import FashionDetailPage from './components/FashionDetailPage';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = (e) => {
    // This function should trigger the search
    e.preventDefault();
    console.log("Searching for:", searchTerm); // Debugging search term
  };

  return (
    <Router>
      <Header 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={handleSearch}
        suggestions={suggestions}
        setSuggestions={setSuggestions}
      />
      <Panel />

      <Routes>
        {/* Main Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/mobile" element={<MobilePage searchTerm={searchTerm} />} />
        <Route path="/laptop" element={<LaptopPage searchTerm={searchTerm} />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/fashion" element={<FashionPage searchTerm={searchTerm} />} />
        <Route path="/fashion-product/:id" element={<FashionDetailPage />} />
        <Route path="/electronics-deals" element={<ElectronicsDealsPage searchTerm={searchTerm} />} />

        {/* Search Result Routes */}
        <Route path="/search-results" element={<SearchResultsPage searchTerm={searchTerm} />} />

        {/* Updated Search Product Detail Page Route with category and id */}
        <Route path="/search-product-detail/:type/:id" element={<SearchProductDetailPage />} />



        {/* Other Routes */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registration-success" element={<RegistrationSuccessPage />} />

        {/* 404 Route for unknown URLs */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
