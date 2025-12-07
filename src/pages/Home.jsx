import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../axios-client';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [showToast, setShowToast] = useState(false);

  const storageUrl = `${import.meta.env.VITE_API_BASE_URL}/storage`;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Erreur lors du chargement des produits:', err);
        // Optionnel: afficher un message d'erreur à l'utilisateur
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleAdd = (product) => {
    addToCart(product);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="relative bg-gray-50 min-h-screen font-sans">
      
      {/* TOAST - Animation améliorée */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.8, rotate: -5 }} 
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }} 
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              duration: 0.4
            }}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 font-bold flex items-center gap-3 border-2 border-green-400 backdrop-blur-md"
          >
            <motion.span 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="bg-white text-green-600 rounded-full h-6 w-6 flex items-center justify-center text-sm font-black"
            >
              ✓
            </motion.span> 
            <motion.span
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Ajouté au panier ! 🛒
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION FUTURISTE --- */}
      <div className="relative bg-gray-900 overflow-hidden perspective-1000">
        
        {/* Fonds animés (Blobs) - Optimisé pour réduire la charge */}
        <motion.div 
          animate={{ scale: [1, 1.15, 1], rotate: [0, 45, 0] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-indigo-600/15 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none will-change-transform" 
        />
        <motion.div 
          animate={{ scale: [1, 1.08, 1], x: [0, 30, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-purple-600/15 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none will-change-transform" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* TEXTE */}
            <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span> BTS SIO 2025
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
                L'Excellence <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient">
                  Hardware.
                </span>
              </h1>
              <p className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed">
                Une sélection rigoureuse de composants et périphériques pour développeurs et administrateurs réseaux. Boostez votre productivité.
              </p>
              <div className="flex gap-4">
                <button onClick={() => document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' })} className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg shadow-indigo-500/20 flex items-center gap-2">
                  <span>Catalogue</span>
                  <span>→</span>
                </button>
                <button className="px-8 py-4 rounded-xl font-bold text-white border border-white/10 hover:bg-white/5 transition backdrop-blur-md">
                  En savoir plus
                </button>
              </div>
            </motion.div>

            {/* ANIMATION GRAPHIQUE ABSTRAITE */}
            <div className="relative h-[400px] w-full flex items-center justify-center perspective-1000 hidden lg:flex">
               {/* Carte Principale */}
               <motion.div 
                 initial={{ rotateY: 15, rotateX: 10, opacity: 0 }} 
                 animate={{ rotateY: 0, rotateX: 0, opacity: 1, y: [0, -10, 0] }} 
                 transition={{ duration: 0.8, opacity: {duration: 0.8}, y: {repeat: Infinity, duration: 8, ease: "easeInOut"} }}
                 className="w-80 h-96 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 relative z-10 will-change-transform"
               >
                  <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 opacity-80 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
                  </div>
                  <div className="h-4 w-24 bg-white/20 rounded-full mb-3"></div>
                  <div className="h-3 w-full bg-white/10 rounded-full mb-2"></div>
                  <div className="h-3 w-2/3 bg-white/10 rounded-full mb-6"></div>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
                    <div className="h-8 w-8 rounded-full bg-indigo-400/20 flex items-center justify-center">⚡</div>
                    <div className="h-8 w-20 bg-white/20 rounded-lg"></div>
                  </div>
               </motion.div>

               {/* Carte Arrière (Flottante) */}
               <motion.div 
                 animate={{ y: [0, 15, 0], rotate: [0, 3, 0] }}
                 transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 0.5 }}
                 className="absolute top-10 right-10 w-64 h-72 bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-3xl shadow-xl -z-10 p-5 will-change-transform"
               >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full bg-gray-700 rounded"></div>
                    <div className="h-2 w-3/4 bg-gray-700 rounded"></div>
                    <div className="h-2 w-1/2 bg-gray-700 rounded"></div>
                  </div>
               </motion.div>

               {/* Elements décoratifs flottants - Optimisés */}
               <motion.div 
                 animate={{ y: [0, -20, 0] }} 
                 transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} 
                 className="absolute bottom-20 left-0 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white font-mono text-xs shadow-lg will-change-transform"
               >
                  &lt;Code /&gt;
               </motion.div>
               <motion.div 
                 animate={{ y: [0, 15, 0] }} 
                 transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }} 
                 className="absolute top-0 right-20 bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-600/40 will-change-transform"
               >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </motion.div>
            </div>
        </div>
      </div>

      {/* --- CATALOGUE --- */}
      <div id="catalog" className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Nos Produits</h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
        </div>
        
        {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => <div key={i} className="h-[400px] bg-gray-200 rounded-3xl animate-pulse"></div>)}
             </div>
        ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map(product => (
                    <motion.div 
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }} 
                        whileInView={{ opacity: 1, y: 0 }} 
                        viewport={{ once: true, margin: "-50px" }}
                        whileHover={{ y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="group bg-white rounded-3xl p-4 shadow-lg shadow-gray-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 border border-gray-100 flex flex-col h-full"
                    >
                        {/* Image */}
                        <div className="h-64 bg-gray-50 rounded-2xl mb-4 relative overflow-hidden group-hover:bg-indigo-50/30 transition duration-500">
                            {product.image_path ? (
                                <>
                                  <img 
                                    src={product.image_path.startsWith('http') ? product.image_path : storageUrl + product.image_path} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" 
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      const fallback = e.target.nextElementSibling;
                                      if (fallback) {
                                        fallback.style.display = 'flex';
                                      }
                                    }}
                                  />
                                  <span className="text-6xl opacity-10 filter grayscale hidden absolute inset-0 flex items-center justify-center">📷</span>
                                </>
                            ) : (
                              <span className="text-6xl opacity-10 filter grayscale absolute inset-0 flex items-center justify-center">📷</span>
                            )}
                        </div>
                        
                        {/* Contenu */}
                        <div className="px-2 flex flex-col flex-grow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition leading-tight">{product.name}</h3>
                                <span className="bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-lg ml-2 shrink-0">{product.price} €</span>
                            </div>
                            <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-grow">
                                {product.description || "Un produit de qualité supérieure."}
                            </p>
                            
                            <button 
                                onClick={() => handleAdd(product)}
                                className="w-full py-3 rounded-xl font-bold bg-gray-900 text-white hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center gap-2 group-active:scale-95 shadow-md"
                            >
                                <span>Ajouter</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                            </button>
                        </div>
                    </motion.div>
                ))}
             </div>
        )}
      </div>
    </div>
  );
}

export default Home;