import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Eğer global stilleriniz varsa

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);