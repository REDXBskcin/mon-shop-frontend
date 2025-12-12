import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../axios-client';
import { CartContext } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const storageUrl = `${import.meta.env.VITE_API_BASE_URL}/storage/`;

  useEffect(() => {
    window.scrollTo(0, 0);
    axiosClient.get(`/products/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => {}) // Gérer erreur silencieusement ou rediriger
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-10 text-center">Chargement...</div>;
  if (!product) return <div className="p-10 text-center">Produit introuvable</div>;

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-6 bg-white shadow-sm mt-4 mb-8 rounded border border-gray-200">
        
        {/* EN-TÊTE PRODUIT */}
        <div className="border-b pb-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1D428A] mb-2">{product.name}</h1>
            <div className="text-sm text-gray-500 flex gap-4">
                <span>Réf. constructeur : XYZ-123</span>
                <span className="text-green-600 font-bold">En stock</span>
                <span>Garantie 2 ans</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLONNE GAUCHE : IMAGE */}
            <div className="lg:col-span-1 bg-white border border-gray-100 p-4 flex items-center justify-center min-h-[300px]">
                {product.image_path ? (
                    <img 
                        src={product.image_path.startsWith('http') ? product.image_path : storageUrl + product.image_path} 
                        alt={product.name}
                        className="max-h-[400px] max-w-full object-contain"
                    />
                ) : (
                    <div className="text-6xl text-gray-200">📷</div>
                )}
            </div>

            {/* COLONNE CENTRE : DESCRIPTION */}
            <div className="lg:col-span-1">
                <h2 className="font-bold text-gray-800 text-lg mb-4 border-b border-gray-100 pb-2">Description</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {product.description || "Aucune description détaillée disponible."}
                </p>
                
                <div className="mt-6 bg-blue-50 p-4 rounded text-sm text-blue-800 border border-blue-100">
                    <p className="font-bold">Les points forts :</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Performance exceptionnelle</li>
                        <li>Rapport qualité/prix</li>
                        <li>Fiabilité reconnue</li>
                    </ul>
                </div>
            </div>

            {/* COLONNE DROITE : PRIX & ACHAT (Box flottante) */}
            <div className="lg:col-span-1">
                <div className="bg-gray-50 border border-gray-200 p-6 rounded shadow-sm sticky top-24">
                    <div className="text-3xl font-black text-[#1D428A] mb-2 text-right">
                        {product.price} € <span className="text-xs text-gray-500 font-normal">TTC</span>
                    </div>
                    
                    <div className="text-right text-xs text-gray-500 mb-6">
                        + 5,99 € de frais de port
                    </div>

                    <button 
                        onClick={() => addToCart(product)}
                        className="w-full bg-[#1D428A] hover:bg-[#15326d] text-white font-bold py-4 rounded shadow transition transform hover:scale-[1.02] flex justify-center items-center gap-2"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        AJOUTER AU PANIER
                    </button>

                    <div className="mt-4 space-y-2 text-xs text-gray-600 border-t pt-4">
                        <div className="flex items-center gap-2">
                            <span className="text-green-500 text-lg">✓</span> Expédié demain
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500 text-lg">✓</span> Retrait magasin gratuit
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500 text-lg">✓</span> Satisfait ou remboursé 14j
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}