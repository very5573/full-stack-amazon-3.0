// src/features/cartSlice.js

import { createSlice } from '@reduxjs/toolkit';

// Initial state: ek empty array for cart items.
const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add to Cart: Agar item already exist kare, toh quantity increment karo,
    // warna naya item add karo with quantity 1.
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }
    },

    // Remove from Cart: Remove karo item uske unique id ke basis par.
    removeFromCart: (state, action) => {
      const idToRemove = action.payload; // Expecting the id
      state.items = state.items.filter(item => item.id !== idToRemove);
    },

    // Increase Quantity: Increase karo item ki quantity.
    increaseQuantity: (state, action) => {
      const id = action.payload; // Expecting the id
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity += 1;
      }
    },

    // Decrease Quantity: Agar quantity 1 se zyada ho, toh reduce karo.
    // Agar quantity 1 hi hai, toh item ko remove karo.
    decreaseQuantity: (state, action) => {
      const id = action.payload; // Expecting the id
      const item = state.items.find(item => item.id === id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter(item => item.id !== id);
        }
      }
    },
  },
});

// Export the actions for use in components.
export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity } = cartSlice.actions;

// Export the reducer to be included in the Redux store.
export default cartSlice.reducer;
