import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import allProducts from '../data/allProducts';
import "../style/SearchResultsPage.css";
const SearchResultsPage = () => {
  const [filteredResults, setFilteredResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All'); // Default to "All" category

  const location = useLocation();

  // URL se query aur category nikaalna
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query') || '';
    const categoryParam = queryParams.get('category') || 'All';

    setSearchTerm(query);
    setCategory(categoryParam);

    // Filter karna allProducts me se
    const filtered = allProducts.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) &&
      (categoryParam === 'All' || item.type?.toLowerCase() === categoryParam.toLowerCase())
    );

    setFilteredResults(filtered);
  }, [location.search]);

  // Agar kuch bhi nahi mila
  if (filteredResults.length === 0) {
    return (
      <div className="search-results-page">
        <h2>No results found for "{searchTerm}" in {category === 'All' ? 'all categories' : category}.</h2>
      </div>
    );
  }

  // Results mil gaye
  return (
    <div className="search-results-page">
      <h2>Search Results for "{searchTerm}" in {category === 'All' ? 'all categories' : category}</h2>
      <div className="search-results-grid">
        {filteredResults.map(item => (
          <Link
            to={`/search-product-detail/${item.type}/${item.id}`}
            key={item.id}
            className="search-result-item"
          >
            <img src={item.img} alt={item.title} />
            <p>{item.title}</p>
            <p>₹{item.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchResultsPage;
