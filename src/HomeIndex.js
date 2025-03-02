import React from 'react';
import { createRoot } from 'react-dom/client';
import Homepage from './components/Homepage';
import './styles.css';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  // Find the container element where React will render
  const container = document.getElementById('react-app');
  
  // Only render if container exists
  if (container) {
    const root = createRoot(container);
    root.render(<Homepage />);
  }
}); 