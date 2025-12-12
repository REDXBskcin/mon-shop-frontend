import { motion } from 'framer-motion';

function ProductCard({ product, onAdd, isAdding, storageUrl }) {
  const isLowStock = product.stock < 10;

  return (
    <div className="bg-white border border-gray-200 rounded-md hover:shadow-lg transition-shadow duration-200 flex flex-col h-full group relative overflow-hidden">
        
        {/* Badge Promo / Stock */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {isLowStock && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">
                    Stock faible
                </span>
            )}
        </div>

        {/* Image */}
        <div className="h-52 p-6 flex items-center justify-center bg-white group-hover:opacity-90 transition cursor-pointer">
            {product.image_path ? (
                <img 
                    src={product.image_path.startsWith('http') ? product.image_path : storageUrl + product.image_path} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain" 
                    loading="lazy"
                />
            ) : (
                <div className="text-gray-200 text-4xl">📷</div>
            )}
        </div>
        
        {/* Contenu */}
        <div className="p-4 flex flex-col flex-grow border-t border-gray-100">
            <div className="mb-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Composant</span>
                <h3 className="text-sm font-bold text-gray-800 leading-tight min-h-[40px] line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors mt-1" title={product.name}>
                    {product.name}
                </h3>
            </div>
            
            {/* Description courte (Specs) */}
            <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                {product.description || "Ref: 123456 • Garantie 2 ans"}
            </p>
            
            {/* Prix et Action */}
            <div className="mt-auto flex items-end justify-between">
                <div>
                    <span className="text-xs text-gray-400 block mb-[-2px]">Prix TTC</span>
                    <span className="text-xl font-bold text-[#1D428A]">{product.price} €</span>
                </div>
                
                <button 
                    onClick={() => onAdd(product)}
                    className={`w-10 h-10 rounded flex items-center justify-center transition-colors ${isAdding ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-[#1D428A] hover:text-white'}`}
                    title="Ajouter au panier"
                >
                    {isAdding ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    )}
                </button>
            </div>
        </div>
    </div>
  );
}

export default ProductCard;