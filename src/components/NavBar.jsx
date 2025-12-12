import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext'; // Import du nouveau contexte
import { motion, AnimatePresence } from 'framer-motion';

function NavBar() {
  const navigate = useNavigate();
  const { cart, setIsCartOpen } = useContext(CartContext);
  const { token, logout, user } = useAuth(); // On récupère les infos depuis le contexte
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // On récupère le rôle pour l'admin (stocké dans le localStorage pour persistance simple)
  const role = localStorage.getItem('role');

  const onLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchTerm.trim()) {
        navigate(`/category/search?q=${searchTerm}`);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col font-sans shadow-md">
      
      {/* HEADER BLEU */}
      <nav className="bg-[#1D428A] text-white h-20 relative z-20">
        <div className="max-w-[1600px] mx-auto px-4 h-full flex items-center gap-4 justify-between">
          
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
            <div className="bg-white text-[#1D428A] font-black text-2xl px-2 py-1 rounded shadow-sm transform -rotate-2 group-hover:rotate-0 transition-transform">
                LDLC
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">High-Tech</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-grow max-w-3xl mx-4">
            <div className="relative w-full flex">
                <button type="button" className="bg-gray-100 text-gray-700 px-4 rounded-l-sm border-r border-gray-300 text-sm font-bold hover:bg-gray-200 transition">
                    Tous nos rayons ▼
                </button>
                <input 
                    type="text" 
                    className="w-full py-2 px-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500 italic"
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="bg-[#35a8e0] text-white px-5 rounded-r-sm hover:bg-[#2b8bc0] transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
            </div>
          </form>

          <div className="flex items-center gap-1 sm:gap-4 text-xs sm:text-sm font-bold">
              
              {/* MENU COMPTE DYNAMIQUE */}
              {token ? (
                  <div className="relative group px-2 cursor-pointer">
                      <div className="flex flex-col items-center gap-1 hover:text-blue-200 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <span>MON COMPTE</span>
                      </div>
                      {/* Dropdown */}
                      <div className="absolute top-full right-0 mt-0 pt-2 w-48 hidden group-hover:block">
                        <div className="bg-white text-gray-800 rounded shadow-xl py-2 border border-gray-200">
                            <div className="px-4 py-2 border-b text-xs text-gray-500">Bonjour {user.name || 'Client'}</div>
                            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Mes commandes</Link>
                            {role === 'admin' && <Link to="/admin" className="block px-4 py-2 text-orange-600 hover:bg-gray-100">Administration</Link>}
                            <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Se déconnecter</button>
                        </div>
                      </div>
                  </div>
              ) : (
                  <Link to="/login" className="flex flex-col items-center gap-1 hover:text-blue-200 transition px-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                      <span>CONNEXION</span>
                  </Link>
              )}

              <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1 hover:text-blue-200 transition px-2 relative">
                <div className="relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    {cart.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-yellow-400 text-[#1D428A] text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#1D428A]">
                            {cart.length}
                        </span>
                    )}
                </div>
                <span>PANIER</span>
              </button>
          </div>
        </div>
      </nav>

      {/* MENU NAVIGATION */}
      <div className="bg-[#002b5c] text-white hidden md:block h-12 shadow-inner border-t border-blue-900">
        <div className="max-w-[1600px] mx-auto px-4 h-full flex items-center text-sm font-bold tracking-wide">
            <div className="flex gap-0 h-full">
                {[{ label: 'ORDINATEURS', slug: 'ordinateurs' }, { label: 'COMPOSANTS', slug: 'composants' }, { label: 'PÉRIPHÉRIQUES', slug: 'peripheriques' }, { label: 'GAMING', slug: 'gaming' }].map((item) => (
                    <Link key={item.slug} to={`/category/${item.slug}`} className="flex items-center h-full px-5 hover:bg-[#1D428A] hover:text-white transition border-r border-white/10">
                        {item.label}
                    </Link>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;