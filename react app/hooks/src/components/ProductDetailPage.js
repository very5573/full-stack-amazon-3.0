import React from 'react';
import { useParams } from 'react-router-dom';
import laptopImages from '../data/laptopData'; // Importing laptop data
import '../style/ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams(); // Get the laptop ID from the URL
  const laptop = laptopImages.find(laptop => laptop.id === parseInt(id)); // Find the laptop by ID

  if (!laptop) {
    return <div>Laptop not found!</div>; // Handle the case where the laptop is not found
  }

  return (
    <div className="product-detail">
      <h1>{laptop.title}</h1>
      <div className="product-info">
        <div className="product-image">
          <img src={laptop.img} alt={laptop.title} />
        </div>
        <div className="product-details">
          <p><strong>Price:</strong> ₹{laptop.price}</p>
          <p>{laptop.description}</p>

          <div className="product-specifications">
            <h3>Specifications:</h3>
            <ul>
              <li><strong>Processor:</strong> Intel Core i7</li>
              <li><strong>RAM:</strong> 16 GB</li>
              <li><strong>Storage:</strong> 512 GB SSD</li>
              <li><strong>Display:</strong> 15.6" Full HD</li>
              <li><strong>Graphics:</strong> Nvidia GTX 1650</li>
            </ul>
          </div>

          <div className="buy-button">
            <button>Add to Cart</button>
            <button>Buy Now</button>
          </div>

          <div className="customer-reviews">
            <h3>Customer Reviews</h3>
            <p>★★★★☆ (200 Reviews)</p>
            <button>See All Reviews</button>
          </div>
        </div>
      </div>

      <div className="related-products">
        <h3>Related Products</h3>
        <div className="related-product-list">
          {laptopImages.slice(0, 4).map(relatedLaptop => (
            <div key={relatedLaptop.id} className="related-product-item">
              <img src={relatedLaptop.img} alt={relatedLaptop.title} />
              <h4>{relatedLaptop.title}</h4>
              <p>₹{relatedLaptop.price}</p>
              <button>View Product</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
