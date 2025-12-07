import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';

import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

import './App.css';

function Layout({ children }) {
  const location = useLocation();
  // On regarde si on est sur la page admin pour le footer et le padding
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* 1. LA NAVBAR EST MAINTENANT PARTOUT */}
      <NavBar />
      
      {/* 2. LE TIROIR PANIER AUSSI */}
      <CartSidebar />
      
      {/* 3. CONTENU */}
      {/* On ajoute toujours pt-20 car la navbar est fixed partout */}
      <div className={`flex-grow pt-20`}>
        {children}
      </div>

      {/* 4. FOOTER (Optionnel sur l'admin, souvent on le cache pour gagner de la place) */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;