import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Tracking from './pages/Tracking';
import Orders from './pages/Orders';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-surface-50">
          <Toaster position="top-center" reverseOrder={false} />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/track" element={<Tracking />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
