import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, setIsCartOpen } = useContext(CartContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const token = localStorage.getItem('token');
  let role = localStorage.getItem('role');
  if (role) role = role.trim();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('ACCESS_TOKEN');
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive 
      ? "text-white font-bold bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm transition" 
      : "text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-gray-900/90 backdrop-blur-md h-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          
          <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-2 group">
            <span className="text-3xl group-hover:rotate-12 transition transform duration-300">🚀</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                BTS Shop
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className={getLinkClass('/')}>🏠 Accueil</Link>
              
              <button 
                onClick={() => setIsCartOpen(true)} 
                className="text-gray-300 hover:text-white px-3 py-2 relative group flex items-center gap-2"
              >
                <span>🛒 Panier</span>
                {cart.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-red-500/50 animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>

              <div className="h-6 w-px bg-gray-700 mx-2"></div>

              {token ? (
                <>
                  {role === 'admin' && (
                    <Link to="/admin" className="text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-gray-900 transition font-bold text-sm">
                      ⚙️ Dashboard
                    </Link>
                  )}
                  
                  <Link to="/profile" className={getLinkClass('/profile')}>👤 Compte</Link>

                  <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm font-medium transition">
                    Déconnexion
                  </button>
                </>
              ) : (
                <div className="flex gap-3">
                   <Link to="/login" className="text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-indigo-900/20 transition transform hover:-translate-y-0.5">
                     Connexion
                   </Link>
                   <Link to="/register" className="text-indigo-200 hover:text-white px-4 py-2 transition font-medium">
                     Inscription
                   </Link>
                </div>
              )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-white/10 py-4">
            <div className="flex flex-col space-y-3 px-4">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass('/')}>
                🏠 Accueil
              </Link>
              
              <button 
                onClick={() => {
                  setIsCartOpen(true);
                  setIsMobileMenuOpen(false);
                }} 
                className="text-gray-300 hover:text-white px-3 py-2 relative flex items-center gap-2 text-left"
              >
                <span>🛒 Panier</span>
                {cart.length > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              {token ? (
                <>
                  {role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 rounded-lg hover:bg-yellow-400 hover:text-gray-900 transition font-bold text-sm">
                      ⚙️ Dashboard
                    </Link>
                  )}
                  
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass('/profile')}>
                    👤 Compte
                  </Link>

                  <button onClick={handleLogout} className="text-red-400 hover:text-red-300 text-sm font-medium transition text-left">
                    Déconnexion
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                   <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-white bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-indigo-900/20 transition text-center">
                     Connexion
                   </Link>
                   <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-indigo-200 hover:text-white px-4 py-2 transition font-medium text-center">
                     Inscription
                   </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;