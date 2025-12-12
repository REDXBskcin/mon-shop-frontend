import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';

// Lazy loading pour améliorer les performances
const Home = lazy(() => import('./pages/Home'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));

import './App.css';

// Composant de chargement
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 font-medium">Chargement...</p>
    </div>
  </div>
);

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
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
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
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;