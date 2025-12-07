import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

function Cart() {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  // Calcul du total
  const total = cart.reduce((acc, item) => acc + Number(item.price || 0), 0);

  // Redirection vers la page de paiement
  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
        <span>🛒</span> Votre Panier
      </h1>

      {cart.length === 0 ? (
        // --- CAS PANIER VIDE (Joli message) ---
        <div className="bg-white rounded-lg shadow-md p-10 text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Votre panier est vide</h2>
          <p className="text-gray-500 mb-6">Vous n'avez pas encore craqué pour nos super produits ?</p>
          <Link to="/" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition duration-300">
            Retourner à la boutique
          </Link>
        </div>
      ) : (
        // --- CAS PANIER REMPLI ---
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* COLONNE GAUCHE : LISTE DES ARTICLES */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  {/* Carré de couleur pour simuler une image */}
                  <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">Ref: {item.id}</p>
                  </div>
                </div>
                <div className="font-bold text-indigo-600">
                  {item.price} €
                </div>
              </div>
            ))}
          </div>

          {/* COLONNE DROITE : RÉCAPITULATIF COMMANDE */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-indigo-50 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Récapitulatif</h2>
              
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Articles ({cart.length})</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between mb-6 text-gray-600">
                <span>Livraison</span>
                <span className="text-green-600 font-medium">Gratuite</span>
              </div>

              <div className="flex justify-between mb-6 text-2xl font-bold text-gray-900 border-t pt-4">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow transition duration-300 transform hover:scale-105"
              >
                Procéder au paiement 💳
              </button>
              
              <p className="text-xs text-center text-gray-400 mt-4">
                Paiement sécurisé - Simulation BTS SIO
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default Cart;