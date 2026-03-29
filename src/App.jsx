import { Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './Sections/Navbar';
import Footer from './Sections/Footer';
import Home from './Pages/Home';
import Products from './Pages/Products';
import SingleProduct from './Pages/SingleProduct'; 
import Cart from './Pages/CartPage'
import Auth from './Pages/Auth'
import About from './Pages/About'

function App() {
  return (
    <div className="App scroll-smooth">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Golden-Flower/" element={<Home />} />

        <Route path="/products" element={<Products />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/about" element={<About />} />
        
        <Route path="/Auth" element={<Auth />} />
                
        {/* ✅ Route الـ SingleProduct */}
        <Route path="/products/:id" element={<SingleProduct />} />
        <Route path="/Golden-Flower/products/:id" element={<SingleProduct />} />


      </Routes>
      <Footer />
    </div>
  )
}

export default App;