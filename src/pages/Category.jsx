import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import axiosClient from '../axios-client';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';

export default function Category() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [addingId, setAddingId] = useState(null);
  
  const storageUrl = `${import.meta.env.VITE_API_BASE_URL}/storage/`;

  useEffect(() => {
    setLoading(true);
    // Dans un vrai cas, on filtrerait côté serveur via ?category=slug
    axiosClient.get('/products')
      .then(({ data }) => {
        // Simulation de filtrage pour l'exemple
        // Si le backend ne gère pas les catégories, on affiche tout ou on mélange
        setProducts(data); 
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAdd = (product) => {
    setAddingId(product.id);
    addToCart(product);
    setTimeout(() => setAddingId(null), 1000);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6">
      
      {/* Fil d'ariane */}
      <div className="text-xs text-gray-500 mb-4 flex gap-2">
        <Link to="/" className="hover:text-blue-600">Accueil</Link> 
        <span>›</span> 
        <span className="uppercase font-bold text-gray-800">{slug}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* SIDEBAR FILTRES (Style LDLC) */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
            <div className="bg-white border border-gray-200 p-4 rounded shadow-sm">
                <h3 className="font-bold text-[#1D428A] mb-3 uppercase text-sm border-b pb-2">Sous-catégories</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li><label className="flex items-center gap-2"><input type="checkbox" /> Asus (12)</label></li>
                    <li><label className="flex items-center gap-2"><input type="checkbox" /> MSI (8)</label></li>
                    <li><label className="flex items-center gap-2"><input type="checkbox" /> Gigabyte (5)</label></li>
                </ul>
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded shadow-sm">
                <h3 className="font-bold text-[#1D428A] mb-3 uppercase text-sm border-b pb-2">Prix</h3>
                <div className="flex gap-2 items-center text-sm">
                    <input type="number" placeholder="Min" className="w-20 border p-1 rounded" />
                    <span>à</span>
                    <input type="number" placeholder="Max" className="w-20 border p-1 rounded" />
                    <button className="bg-gray-200 px-2 py-1 rounded">OK</button>
                </div>
            </div>
        </div>

        {/* LISTE PRODUITS */}
        <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1D428A] uppercase mb-4 border-b border-gray-300 pb-2">
                {slug.replace('-', ' ')} <span className="text-gray-400 text-lg font-normal">({products.length} articles)</span>
            </h1>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => <div key={i} className="bg-white h-80 animate-pulse border border-gray-200"></div>)}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {products.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onAdd={handleAdd}
                            isAdding={addingId === product.id}
                            storageUrl={storageUrl}
                        />
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}