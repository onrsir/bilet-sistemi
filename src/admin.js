import React from 'react';
import { createRoot } from 'react-dom/client';
import AdminPanel from './components/AdminPanel';
import './styles.css';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Get the container element
  const container = document.getElementById('app');
  
  // Create a root
  const root = createRoot(container);
  
  // Render the Admin Panel component
  root.render(<AdminPanel />);
}); 