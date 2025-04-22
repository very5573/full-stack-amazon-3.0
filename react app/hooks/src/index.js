// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';  // Updated import for React 18+
import { Provider } from 'react-redux';
import store from './app/store';
import App from './App';

// Create root for rendering in React 18+
const root = ReactDOM.createRoot(document.getElementById('root'));

// Use root.render instead of ReactDOM.render
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
