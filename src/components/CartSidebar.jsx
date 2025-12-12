import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

function CartSidebar() {
  const { cart, removeFromCart, isCartOpen, setIsCartOpen } = useContext(CartContext);
  
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  const total = cart.reduce((acc, item) => acc + Number(item.price), 0);
  const storageUrl = `${import.meta.env.VITE_API_BASE_URL}/storage/`;

  // Logique "Livraison Gratuite"
  const FREE_SHIPPING_THRESHOLD = 500;
  const progress = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - total;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-gray-900/80 z-50 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full sm:max-w-[450px] bg-white shadow-2xl z-50 flex flex-col font-sans h-screen"
          >
            
            {/* Header */}
            <div className="px-6 py-6 bg-white flex justify-between items-center flex-shrink-0 z-10">
              <h2 className="text-2xl font-black text-gray-900">Mon Panier</h2>
              <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-500">✕</button>
            </div>

            {/* Barre de Livraison Gratuite */}
            {cart.length > 0 && (
                <div className="px-6 pb-6 border-b border-gray-100">
                    <div className="mb-2 flex justify-between text-sm font-medium">
                        {remaining > 0 ? (
                            <span className="text-gray-600">Plus que <span className="text-indigo-600 font-bold">{remaining.toFixed(2)}€</span> pour la livraison offerte !</span>
                        ) : (
                            <span className="text-green-600 font-bold flex items-center gap-1">🎉 Livraison offerte !</span>
                        )}
                        <span className="text-gray-400">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${remaining <= 0 ? 'bg-green-500' : 'bg-indigo-600'}`}
                        />
                    </div>
                </div>
            )}

            {/* Liste des produits */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
                  <div className="text-6xl mb-2">🛒</div>
                  <p className="text-gray-500 font-medium">Votre panier est vide</p>
                  <button onClick={() => setIsCartOpen(false)} className="text-indigo-600 font-bold hover:underline">Découvrir nos produits</button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cart.map((item, index) => (
                    <motion.div 
                      layout
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
                      className="flex gap-4 bg-white p-2 rounded-xl group"
                    >
                      <div className="h-20 w-20 bg-white rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.image_path ? (
                            <img src={item.image_path.startsWith('http') ? item.image_path : storageUrl + item.image_path} alt={item.name} className="w-full h-full object-contain p-1" />
                        ) : (
                            <span>📷</span>
                        )}
                      </div>
                      <div className="flex-grow flex flex-col justify-center min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm truncate pr-4">{item.name}</h3>
                        <div className="mt-1 flex items-center justify-between">
                            <span className="font-bold text-indigo-600">{item.price} €</span>
                            <button 
                                onClick={() => removeFromCart(index)}
                                className="text-xs text-gray-400 hover:text-red-500 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                            >
                                Supprimer
                            </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer Total & Actions */}
            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-medium">Sous-total</span>
                  <span className="text-2xl font-black text-gray-900 tracking-tight">{total.toFixed(2)} €</span>
                </div>
                <Link 
                  to={isAuthenticated ? "/checkout" : "/login"}
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-500/30 flex items-center justify-center gap-2 group"
                >
                  <span>{isAuthenticated ? "Payer maintenant" : "Se connecter pour payer"}</span>
                  <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </Link>
                <Link 
                    to="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="block text-center mt-3 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                    Voir le détail du panier
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartSidebar;