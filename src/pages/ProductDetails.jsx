import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../axios-client';
import { CartContext } from '../context/CartContext';
import { motion } from 'framer-motion';

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('desc'); // desc, specs, reviews
  const storageUrl = `${import.meta.env.VITE_API_BASE_URL}/storage/`;

  useEffect(() => {
    window.scrollTo(0, 0); // Remonter en haut de page au chargement
    axiosClient.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => alert("Produit introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-10 w-10 border-4 border-indigo-600 rounded-full border-t-transparent"></div></div>;
  if (!product) return <div className="text-center py-20">Produit introuvable</div>;

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Fil d'ariane */}
      <div className="max-w-7xl mx-auto px-4 py-4 text-sm text-gray-500">
        <Link to="/" className="hover:text-indigo-600">Accueil</Link> / <span className="text-gray-900">{product.name}</span>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* GALERIE IMAGE */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 flex items-center justify-center h-[500px] group overflow-hidden">
            {product.image_path ? (
               <img 
                 src={product.image_path.startsWith('http') ? product.image_path : storageUrl + product.image_path} 
                 alt={product.name} 
                 className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition duration-700 ease-in-out" 
               />
            ) : <span className="text-4xl">📷</span>}
          </div>
        </motion.div>

        {/* INFO PRODUIT */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <span className="text-indigo-600 font-bold tracking-wider text-sm uppercase">Nouveau</span>
          <h1 className="text-4xl font-black text-gray-900 mt-2 mb-4 leading-tight">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-gray-900">{product.price} €</span>
            {product.stock > 0 ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">En stock</span>
            ) : (
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">Rupture</span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-8 text-lg">
            {product.description || "Aucune description détaillée disponible pour ce produit de haute technologie."}
          </p>

          <div className="flex gap-4 border-t border-gray-100 pt-8">
            <button 
                onClick={() => addToCart(product)}
                className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-indigo-600 transition shadow-xl shadow-indigo-500/10 active:scale-95"
            >
                Ajouter au panier
            </button>
            <button className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-gray-500">
                ❤️
            </button>
          </div>

          {/* ONGLETS (Specs, Avis) */}
          <div className="mt-12">
            <div className="flex border-b border-gray-200 mb-6">
                {['Description', 'Caractéristiques', 'Avis'].map((tab) => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 px-4 font-medium transition relative ${activeTab === tab ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        {tab}
                        {activeTab === tab && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
                    </button>
                ))}
            </div>
            <div className="text-gray-600">
                {activeTab === 'Description' && <p>Détails approfondis sur {product.name}...</p>}
                {activeTab === 'Caractéristiques' && (
                    <ul className="space-y-2 list-disc pl-5">
                        <li>Garantie constructeur 2 ans</li>
                        <li>Livraison rapide 24/48h</li>
                    </ul>
                )}
                {activeTab === 'Avis' && <p>⭐⭐⭐⭐⭐ (4.8/5) basé sur 12 avis.</p>}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default ProductDetails;