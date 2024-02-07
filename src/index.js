import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AppProvider } from './context/index'
import { ShippingProvider } from './context/shippingContext'
import reportWebVitals from './reportWebVitals';
import './assets/css/main.css';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProvider>
    <ShippingProvider>
    <BrowserRouter>
    <App />
  </BrowserRouter>
    </ShippingProvider>
  </AppProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
