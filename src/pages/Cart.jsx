import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const total = cart.reduce((acc, item) => acc + Number(item.price || 0), 0);
  const storageUrl = `${import.meta.env.VITE_API_BASE_URL}/storage/`;

  if (cart.length === 0) {
    return (
        <div className="max-w-4xl mx-auto py-20 text-center">
            <h2 className="text-3xl font-bold text-gray-300 mb-4">Votre panier est vide</h2>
            <Link to="/" className="bg-[#1D428A] text-white px-6 py-2 rounded font-bold hover:bg-blue-800">Retourner à la boutique</Link>
        </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#1D428A] uppercase mb-6 border-b pb-2">Mon Panier ({cart.length})</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* TABLEAU PRODUITS */}
        <div className="flex-1 bg-white border border-gray-200 shadow-sm rounded overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase border-b">
                    <tr>
                        <th className="p-4">Produit</th>
                        <th className="p-4 text-center">Prix</th>
                        <th className="p-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {cart.map((item, index) => (
                        <tr key={index}>
                            <td className="p-4 flex items-center gap-4">
                                <div className="w-16 h-16 border bg-white flex items-center justify-center p-1">
                                    {item.image_path ? (
                                        <img src={item.image_path.startsWith('http') ? item.image_path : storageUrl + item.image_path} className="max-h-full max-w-full" />
                                    ) : '📷'}
                                </div>
                                <div>
                                    <Link to={`/product/${item.id}`} className="font-bold text-[#1D428A] hover:underline block mb-1">
                                        {item.name}
                                    </Link>
                                    <span className="text-xs text-green-600">En stock</span>
                                </div>
                            </td>
                            <td className="p-4 text-center font-bold text-gray-800">{item.price} €</td>
                            <td className="p-4 text-right">
                                <button onClick={() => removeFromCart(index)} className="text-red-500 hover:text-red-700 text-sm underline">Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* TOTAL */}
        <div className="w-full lg:w-80 bg-white border border-gray-200 shadow-sm p-6 rounded h-fit">
            <div className="flex justify-between mb-2 text-sm">
                <span>Sous-total HT</span>
                <span>{(total * 0.8).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between mb-4 text-sm">
                <span>TVA (20%)</span>
                <span>{(total * 0.2).toFixed(2)} €</span>
            </div>
            <div className="flex justify-between mb-6 text-xl font-black text-[#1D428A] border-t pt-4">
                <span>TOTAL TTC</span>
                <span>{total.toFixed(2)} €</span>
            </div>
            
            <button 
                onClick={() => navigate(token ? '/checkout' : '/login')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded shadow transition uppercase"
            >
                Valider ma commande
            </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;