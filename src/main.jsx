import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter, HashRouter } from 'react-router-dom';
import {CartProvider} from './Context/CartContext'
import {ThemeProvider} from './Context/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
      <CartProvider>
        <App />
      </CartProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
)
