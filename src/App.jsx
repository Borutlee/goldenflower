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
import Contact from './Pages/Contact'
import UserProfile from './Pages/userProfile'
import ScrollToTop from './Components/scrollToTop';
import { useTheme } from './Context/ThemeContext'
import ProtectedRoute from './Components/ProtectedRoute';
import ProtectedAdminRoute from './Components/ProtectedAdminRoute';
import AdminPanel from './Pages/AdminPanel';


function App() {

  const { isDark } = useTheme();

  return (
    <div className={`App scroll-smooth ${isDark ? 'dark' : ''}`}>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Golden-Flower/" element={<Home />} />

        <Route path="/products" element={<Products />} />

        <Route path="/cart" element={<Cart />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/Auth" element={<Auth />} />

        <Route path="/userProfile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <AdminPanel />
          </ProtectedAdminRoute>
        } />


        {/* ✅ Route الـ SingleProduct */}
        <Route path="/products/:id" element={<SingleProduct />} />
        <Route path="/Golden-Flower/products/:id" element={<SingleProduct />} />


      </Routes>
      <Footer />
    </div>
  )
}

export default App;
