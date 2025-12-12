import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useContext, useMemo } from 'react';
import axiosClient from '../axios-client';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';

export default function Category() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || ''; // Récupère ?q=... dans l'URL

  const [allProducts, setAllProducts] = useState([]); // Tous les produits bruts
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [addingId, setAddingId] = useState(null);
  
  // États pour les filtres locaux
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedBrands, setSelectedBrands] = useState([]);

  const storageUrl = `${import.meta.env.VITE_API_BASE_URL}/storage/`;

  // 1. Chargement initial des données
  useEffect(() => {
    setLoading(true);
    axiosClient.get('/products')
      .then(({ data }) => {
        setAllProducts(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]); // On recharge si on change de page catégorie

  // 2. Logique de filtrage (Le "Cerveau")
  const filteredProducts = useMemo(() => {
    let result = allProducts;

    // A. Filtre par Catégorie (slug)
    // Si on est pas en mode "recherche" ou "soldes", on filtre par catégorie
    if (slug && slug !== 'search' && slug !== 'soldes') {
        // Astuce simple: on regarde si la description ou le nom contient le slug
        // Dans un vrai projet, il faudrait un champ 'category_id' dans la BDD
        const term = slug.slice(0, -1); // enlever le 's' (ordinateurs -> ordinateur)
        result = result.filter(p => 
            p.name.toLowerCase().includes(term) || 
            (p.description && p.description.toLowerCase().includes(term))
        );
    }

    // B. Filtre par Recherche (Barre de nav)
    if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        result = result.filter(p => 
            p.name.toLowerCase().includes(lowerQ) || 
            (p.description && p.description.toLowerCase().includes(lowerQ))
        );
    }

    // C. Filtre par Prix (Sidebar)
    if (priceRange.min) {
        result = result.filter(p => parseFloat(p.price) >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
        result = result.filter(p => parseFloat(p.price) <= parseFloat(priceRange.max));
    }

    return result;
  }, [allProducts, slug, searchQuery, priceRange, selectedBrands]);

  const handleAdd = (product) => {
    setAddingId(product.id);
    addToCart(product);
    setTimeout(() => setAddingId(null), 1000);
  };

  // Titre dynamique de la page
  const getPageTitle = () => {
      if (searchQuery) return `Résultats pour "${searchQuery}"`;
      if (slug === 'soldes') return 'Promotions en cours';
      return slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ');
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6">
      
      {/* Fil d'ariane */}
      <div className="text-xs text-gray-500 mb-4 flex gap-2">
        <Link to="/" className="hover:text-blue-600">Accueil</Link> 
        <span>›</span> 
        <span className="uppercase font-bold text-gray-800">{getPageTitle()}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* SIDEBAR FILTRES */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-4">
            
            {/* Filtre Prix */}
            <div className="bg-white border border-gray-200 p-4 rounded shadow-sm">
                <h3 className="font-bold text-[#1D428A] mb-3 uppercase text-sm border-b pb-2">Prix</h3>
                <div className="flex gap-2 items-center text-sm mb-2">
                    <input 
                        type="number" 
                        placeholder="Min" 
                        className="w-20 border p-1 rounded outline-none focus:border-blue-500"
                        value={priceRange.min}
                        onChange={e => setPriceRange({...priceRange, min: e.target.value})}
                    />
                    <span>à</span>
                    <input 
                        type="number" 
                        placeholder="Max" 
                        className="w-20 border p-1 rounded outline-none focus:border-blue-500"
                        value={priceRange.max}
                        onChange={e => setPriceRange({...priceRange, max: e.target.value})}
                    />
                </div>
                <button 
                    onClick={() => setPriceRange({min:'', max:''})}
                    className="text-xs text-blue-600 hover:underline w-full text-right"
                >
                    Effacer
                </button>
            </div>

            {/* Publicité encart (pour combler le vide) */}
            <div className="bg-gray-100 p-4 rounded text-center border border-gray-200">
                <p className="font-bold text-[#1D428A] text-sm">Besoin d'aide ?</p>
                <p className="text-xs text-gray-600 mt-1">Nos experts vous répondent au 01.23.45.67.89</p>
            </div>
        </div>

        {/* LISTE PRODUITS */}
        <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1D428A] uppercase mb-4 border-b border-gray-300 pb-2 flex justify-between items-end">
                <span>{getPageTitle()}</span>
                <span className="text-gray-400 text-sm font-normal normal-case mb-1">{filteredProducts.length} référence(s)</span>
            </h1>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => <div key={i} className="bg-white h-80 animate-pulse border border-gray-200"></div>)}
                </div>
            ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map(product => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            onAdd={handleAdd}
                            isAdding={addingId === product.id}
                            storageUrl={storageUrl}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white p-10 text-center border border-gray-200 rounded">
                    <div className="text-4xl mb-4">🕵️‍♂️</div>
                    <h3 className="text-lg font-bold text-gray-800">Aucun produit trouvé</h3>
                    <p className="text-gray-500 text-sm mt-2">Essayez de modifier vos filtres ou votre recherche.</p>
                    <button 
                        onClick={() => {setPriceRange({min:'', max:''});}}
                        className="mt-4 text-blue-600 font-bold hover:underline text-sm"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}