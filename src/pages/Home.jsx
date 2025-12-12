import { useState, useEffect, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import axiosClient from '../axios-client';
import ProductCard from '../components/ProductCard';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [showToast, setShowToast] = useState(false);
  const [addingProductId, setAddingProductId] = useState(null);

  const storageUrl = `${import.meta.env.VITE_API_BASE_URL}/storage/`;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosClient.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Erreur produits:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAdd = (product) => {
    setAddingProductId(product.id);
    addToCart(product);
    setShowToast(true);
    setTimeout(() => {
        setAddingProductId(null);
        setShowToast(false);
    }, 2000);
  };

  return (
    <div className="bg-[#F2F4F8] min-h-screen font-sans pt-8"> {/* Fond gris très clair pour faire ressortir les cartes blanches */}
      
      {/* TOAST */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }} 
            animate={{ opacity: 1, y: 0, x: '-50%' }} 
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg flex items-center gap-3 font-bold text-sm"
          >
            <span>✅ Produit ajouté au panier</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto px-4 mt-8"> {/* Marge top pour compenser la navbar fixe */}
        
        {/* --- ZONE BANNIERE STYLE LDLC --- */}
        {/* On remplace le grand hero par une bannière plus contenue */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
            {/* Grande Bannière Slider */}
            <div className="lg:col-span-3 bg-white rounded shadow-sm overflow-hidden h-[300px] sm:h-[400px] relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1D428A] to-blue-600 flex items-center px-12">
                    <div className="text-white z-10 max-w-lg">
                        <span className="bg-yellow-400 text-[#1D428A] text-xs font-bold px-2 py-1 rounded mb-4 inline-block">OFFRE DU JOUR</span>
                        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">SETUP GAMING <br/>ULTIME 2025</h1>
                        <p className="text-blue-100 mb-6 font-medium">Découvrez notre sélection de composants pour monter la machine de vos rêves.</p>
                        <button className="bg-white text-[#1D428A] px-6 py-3 rounded font-bold hover:bg-gray-100 transition shadow-lg">
                            J'en profite ▸
                        </button>
                    </div>
                    {/* Décoration de fond */}
                    <div className="absolute right-0 bottom-0 h-full w-1/2 bg-[url('https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80')] bg-cover bg-no-repeat opacity-20 mix-blend-overlay"></div>
                </div>
            </div>

            {/* Petites Bannières Latérales (Promo) */}
            <div className="hidden lg:flex flex-col gap-4 h-[400px]">
                <div className="flex-1 bg-white rounded shadow-sm p-6 flex flex-col justify-center border-l-4 border-yellow-400 relative overflow-hidden cursor-pointer hover:shadow-md transition">
                    <h3 className="font-bold text-gray-800 text-xl z-10">PROMO SSD</h3>
                    <p className="text-gray-500 text-sm z-10">Jusqu'à -30% sur Samsung</p>
                    <div className="absolute right-[-20px] bottom-[-20px] text-9xl text-gray-100 font-black -z-0">%</div>
                </div>
                <div className="flex-1 bg-gray-900 rounded shadow-sm p-6 flex flex-col justify-center text-white relative overflow-hidden cursor-pointer hover:shadow-md transition">
                    <h3 className="font-bold text-xl z-10">CONFIGURATEUR</h3>
                    <p className="text-gray-400 text-sm z-10">Créez votre PC sur mesure</p>
                    <div className="absolute right-4 bottom-4 text-4xl">🛠️</div>
                </div>
            </div>
        </div>

        {/* --- BARRE DE SERVICES (Confiance) --- */}
        <div className="bg-white rounded shadow-sm p-4 mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 divide-x divide-gray-100">
            <div className="flex items-center gap-3 justify-center text-gray-700">
                <span className="text-2xl">🚚</span>
                <div className="flex flex-col text-xs">
                    <span className="font-bold">Livraison Rapide</span>
                    <span className="text-gray-500">24/48h chez vous</span>
                </div>
            </div>
            <div className="flex items-center gap-3 justify-center text-gray-700">
                <span className="text-2xl">🛡️</span>
                <div className="flex flex-col text-xs">
                    <span className="font-bold">Garantie 2 ans</span>
                    <span className="text-gray-500">SAV en France</span>
                </div>
            </div>
            <div className="flex items-center gap-3 justify-center text-gray-700">
                <span className="text-2xl">💳</span>
                <div className="flex flex-col text-xs">
                    <span className="font-bold">Paiement Sécurisé</span>
                    <span className="text-gray-500">CB, PayPal, 3x sans frais</span>
                </div>
            </div>
            <div className="flex items-center gap-3 justify-center text-gray-700">
                <span className="text-2xl">📞</span>
                <div className="flex flex-col text-xs">
                    <span className="font-bold">Service Client</span>
                    <span className="text-gray-500">01 23 45 67 89</span>
                </div>
            </div>
        </div>

        {/* --- CATALOGUE --- */}
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 uppercase border-l-4 border-[#1D428A] pl-3">
                    Nos Meilleures Ventes
                </h2>
                <a href="#" className="text-sm font-bold text-blue-600 hover:underline">Voir tout ▸</a>
            </div>
            
            {loading ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="bg-white h-[350px] animate-pulse rounded shadow-sm border border-gray-100"></div>
                    ))}
                 </div>
            ) : (
                 <motion.div 
                    layout 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                 >
                    <AnimatePresence>
                        {products.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onAdd={handleAdd}
                                isAdding={addingProductId === product.id}
                                storageUrl={storageUrl}
                            />
                        ))}
                    </AnimatePresence>
                 </motion.div>
            )}
        </div>

      </div>
    </div>
  );
}

export default Home;