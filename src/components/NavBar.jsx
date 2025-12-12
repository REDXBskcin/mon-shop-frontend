import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

function NavBar() {
  const navigate = useNavigate();
  const { cart, setIsCartOpen } = useContext(CartContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const token = localStorage.getItem('token');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('ACCESS_TOKEN');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Idéalement, rediriger vers une page de recherche ou filtrer via Context
    console.log("Recherche de :", searchTerm);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col font-sans">
      
      {/* --- ETAGE 1 : MAIN HEADER (Style LDLC Bleu) --- */}
      <nav className="bg-[#1D428A] text-white shadow-md relative z-20 h-20">
        <div className="max-w-[1600px] mx-auto px-4 h-full flex items-center gap-4 justify-between">
          
          {/* 1. LOGO */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
            <div className="bg-white text-[#1D428A] font-black text-2xl px-2 py-1 rounded shadow-sm transform -rotate-3 group-hover:rotate-0 transition-transform duration-300">
                LDLC
            </div>
            {/* Version mobile du logo si besoin */}
            <span className="font-bold text-xl tracking-tight hidden sm:block">BTS High-Tech</span>
          </Link>

          {/* 2. BARRE DE RECHERCHE CENTRALE (Massive) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-grow max-w-3xl mx-4 relative">
            <div className="relative w-full flex">
                <button type="button" className="bg-gray-100 text-gray-700 px-4 rounded-l-md border-r border-gray-300 text-sm font-bold hover:bg-gray-200 transition">
                    Tous les univers ▼
                </button>
                <input 
                    type="text" 
                    className="w-full py-2.5 px-4 text-gray-900 outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500 italic"
                    placeholder="Chercher un produit, une marque, une catégorie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="bg-white text-[#1D428A] px-4 rounded-r-md hover:bg-gray-50 transition">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
            </div>
          </form>

          {/* 3. ACTIONS DROITE (Compte, Panier) */}
          <div className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-medium">
              
              {/* Bouton Panier */}
              <button 
                onClick={() => setIsCartOpen(true)} 
                className="flex flex-col items-center gap-1 hover:text-blue-200 transition group relative"
              >
                <div className="relative">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-yellow-400 text-[#1D428A] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-[#1D428A]">
                            {cart.length}
                        </span>
                    )}
                </div>
                <span>PANIER</span>
              </button>

              {/* Bouton Compte */}
              {token ? (
                  <div className="flex flex-col items-center gap-1 group relative cursor-pointer">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      <span>COMPTE ▼</span>
                      
                      {/* Dropdown Menu */}
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-xl py-2 hidden group-hover:block border border-gray-200">
                          <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Mon profil</Link>
                          <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100 text-yellow-600">Admin</Link>
                          <div className="border-t my-1"></div>
                          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Déconnexion</button>
                      </div>
                  </div>
              ) : (
                  <Link to="/login" className="flex flex-col items-center gap-1 hover:text-blue-200 transition">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>CONNEXION</span>
                  </Link>
              )}

              {/* Mobile Burger */}
              <button 
                className="md:hidden ml-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
          </div>
        </div>
      </nav>

      {/* --- ETAGE 2 : CATEGORIES (Bleu foncé, style Desktop) --- */}
      <div className="bg-[#0f2d6b] text-white hidden md:block shadow-inner h-12">
        <div className="max-w-[1600px] mx-auto px-4 h-full flex items-center text-sm font-bold tracking-wide">
            <div className="bg-blue-500 h-full flex items-center px-6 cursor-pointer hover:bg-blue-400 transition mr-4 uppercase">
                ≡ Nos Rayons
            </div>
            <div className="flex gap-8 h-full">
                {['Configurateur PC', 'PC Portables', 'Composants', 'Périphériques', 'Soldes', 'Nouveautés'].map((item) => (
                    <a key={item} href="#" className="flex items-center h-full hover:text-blue-300 transition relative group">
                        {item}
                        {/* Petite barre de soulignement au hover */}
                        <span className="absolute bottom-0 left-0 w-0 h-1 bg-yellow-400 transition-all group-hover:w-full"></span>
                    </a>
                ))}
            </div>
            <div className="ml-auto flex items-center gap-4 text-xs font-normal text-blue-200">
                <span className="flex items-center gap-1 cursor-pointer hover:text-white">Questions ? Besoin d'aide ?</span>
            </div>
        </div>
      </div>

      {/* --- MOBILE SEARCH BAR (Visible uniquement sur mobile) --- */}
      <div className="md:hidden bg-[#1D428A] p-2 pb-3">
        <input 
            type="text" 
            className="w-full py-2 px-4 rounded text-gray-900 outline-none"
            placeholder="Rechercher..."
        />
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-200 shadow-xl overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-2 text-gray-800 font-medium">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b">Accueil</Link>
                <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b">Mon Panier</Link>
                <div className="py-2 text-gray-500 text-sm font-bold uppercase mt-2">Catégories</div>
                <a href="#" className="pl-4 py-1">Ordinateurs</a>
                <a href="#" className="pl-4 py-1">Composants</a>
                <a href="#" className="pl-4 py-1">Gaming</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NavBar;