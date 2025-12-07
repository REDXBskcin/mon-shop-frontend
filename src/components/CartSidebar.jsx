import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

function CartSidebar() {
  const { cart, removeFromCart, isCartOpen, setIsCartOpen } = useContext(CartContext);
  
  // Vérifier si l'utilisateur est connecté
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  
  const total = cart.reduce((acc, item) => acc + Number(item.price), 0);
  const storageUrl = `${import.meta.env.VITE_API_BASE_URL}/storage`;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
          />

          <motion.div 
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white shadow-2xl z-50 flex flex-col font-sans h-screen"
          >
            {/* HEADER - Fixé en haut */}
            <div className="px-6 py-5 bg-white border-b flex justify-between items-center shadow-sm flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span>🛍️</span> Panier <span className="bg-gray-100 text-sm px-2 py-0.5 rounded-full text-gray-600">{cart.length}</span>
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 transition bg-gray-50 rounded-full">✕</button>
            </div>

            {/* CONTENU SCROLLABLE - Prend l'espace disponible */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50 min-h-0">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                  <p className="text-lg font-medium">Votre panier est vide.</p>
                  <button onClick={() => setIsCartOpen(false)} className="text-indigo-600 font-bold hover:underline">Continuer mes achats</button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {cart.map((item, index) => (
                    <motion.div 
                      layout
                      key={`${item.id}-${index}`}
                      initial={{ opacity: 0, x: -20, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ 
                        opacity: 0, 
                        x: 100, 
                        scale: 0.8,
                        transition: { duration: 0.3 }
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 25,
                        layout: { duration: 0.3 }
                      }}
                      className="flex gap-4 bg-white p-3 rounded-2xl shadow-sm border border-gray-100"
                    >
                      {/* IMAGE MINIATURE */}
                      <motion.div 
                        initial={{ scale: 0.8, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                        className="h-20 w-20 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0"
                      >
                        {item.image_path ? (
                            <img 
                              src={item.image_path.startsWith('http') ? item.image_path : storageUrl + item.image_path} 
                              alt={item.name} 
                              className="w-full h-full object-contain p-2" 
                              loading="lazy"
                              decoding="async"
                            />
                        ) : (
                            <span className="text-2xl opacity-20">📦</span>
                        )}
                      </motion.div>
                      
                      <div className="flex-grow flex flex-col justify-center">
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h3>
                        <p className="text-indigo-600 font-bold mt-1">{item.price} €</p>
                      </div>

                      <motion.button 
                        onClick={() => removeFromCart(index)}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="text-gray-400 hover:text-red-500 self-center p-2 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      </motion.button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* FOOTER - Fixé en bas */}
            {cart.length > 0 && (
              <div className="border-t p-4 sm:p-6 bg-white z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] flex-shrink-0">
                <div className="flex justify-between text-lg sm:text-xl font-bold mb-4 text-gray-900">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                <Link 
                  to={isAuthenticated ? "/cart" : "/login"}
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full bg-gray-900 text-white text-center py-3 sm:py-4 rounded-xl font-bold hover:bg-black transition shadow-xl"
                >
                  {isAuthenticated ? "Commander" : "Se connecter"}
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