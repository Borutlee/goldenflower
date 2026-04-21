import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter, HashRouter } from 'react-router-dom';
import {CartProvider} from './Context/CartContext'
import {ThemeProvider} from './Context/ThemeContext'
import {WishlistProvider} from './Context/wishlistContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider>
        <CartProvider>
          <WishlistProvider>
            <App />
          </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
)
