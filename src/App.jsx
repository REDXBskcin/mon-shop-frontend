import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';

// Lazy loading
const Home = lazy(() => import('./pages/Home'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
// Nouvelles pages
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Category = lazy(() => import('./pages/Category'));

import './App.css';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="text-[#1D428A] font-bold text-lg animate-pulse">Chargement...</div>
  </div>
);

function Layout({ children }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#F2F4F8] flex flex-col font-sans text-gray-800">
      <NavBar />
      <CartSidebar />
      
      {/* Marge top pour compenser le header fixe (NavBar h-32 approx) */}
      <div className="flex-grow pt-32 sm:pt-36">
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </div>

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
          
          {/* Nouvelles Routes */}
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/category/:slug" element={<Category />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;