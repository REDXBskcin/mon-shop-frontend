import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios-client.js';
import { CartContext } from '../context/CartContext';
import { motion } from 'framer-motion';

function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  // États pour le formulaire de paiement
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    address: '',
    city: '',
    zipCode: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  // Calcul du total
  const total = cart.reduce((acc, item) => acc + Number(item.price || 0), 0);

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    // Validation numéro de carte (16 chiffres)
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Le numéro de carte doit contenir 16 chiffres';
    }
    
    // Validation nom sur la carte
    if (!paymentData.cardName || paymentData.cardName.length < 3) {
      newErrors.cardName = 'Le nom sur la carte est requis';
    }
    
    // Validation date d'expiration (MM/YY)
    if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      newErrors.expiryDate = 'Format requis : MM/AA';
    }
    
    // Validation CVV (3 chiffres)
    if (!paymentData.cvv || paymentData.cvv.length !== 3) {
      newErrors.cvv = 'Le CVV doit contenir 3 chiffres';
    }
    
    // Validation adresse
    if (!paymentData.address || paymentData.address.length < 5) {
      newErrors.address = 'L\'adresse est requise';
    }
    
    // Validation ville
    if (!paymentData.city || paymentData.city.length < 2) {
      newErrors.city = 'La ville est requise';
    }
    
    // Validation code postal
    if (!paymentData.zipCode || paymentData.zipCode.length < 5) {
      newErrors.zipCode = 'Le code postal est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Formatage automatique du numéro de carte
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Formatage automatique de la date d'expiration
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Traitement du paiement
  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulation d'un délai de traitement (pour un vrai projet, on appellerait une API de paiement)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Création de la commande
      const orderData = {
        cart: cart,
        total: total,
        payment_method: 'card', // Méthode de paiement
        payment_status: 'paid' // Statut du paiement
      };

      const response = await axiosClient.post('/orders', orderData);
      
      // Succès !
      alert(`✅ Paiement réussi ! Votre commande n°${response.data.id} est validée.`);
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors du paiement', error);
      alert('❌ Une erreur est survenue lors du paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-10 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Votre panier est vide</h2>
          <p className="text-gray-500 mb-6">Ajoutez des produits avant de procéder au paiement.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            Retourner à la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center gap-2">
        <span>💳</span> Paiement
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        
        {/* FORMULAIRE DE PAIEMENT */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Informations de paiement</h2>
            
            <form onSubmit={handlePayment} className="space-y-6">
              
              {/* CARTE BANCAIRE */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm opacity-90">Carte bancaire</span>
                  <span className="text-2xl">💳</span>
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData({...paymentData, cardNumber: formatCardNumber(e.target.value)})}
                    maxLength="19"
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  {errors.cardNumber && <p className="text-red-200 text-xs mt-1">{errors.cardNumber}</p>}
                </div>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="NOM SUR LA CARTE"
                    value={paymentData.cardName}
                    onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value.toUpperCase()})}
                    className="w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  {errors.cardName && <p className="text-red-200 text-xs mt-1">{errors.cardName}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={paymentData.expiryDate}
                      onChange={(e) => setPaymentData({...paymentData, expiryDate: formatExpiryDate(e.target.value)})}
                      maxLength="5"
                      className="w-full bg-white/20 border border-white/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base"
                    />
                    {errors.expiryDate && <p className="text-red-200 text-xs mt-1">{errors.expiryDate}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="CVV"
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value.replace(/\D/g, '').substring(0, 3)})}
                      maxLength="3"
                      className="w-full bg-white/20 border border-white/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm sm:text-base"
                    />
                    {errors.cvv && <p className="text-red-200 text-xs mt-1">{errors.cvv}</p>}
                  </div>
                </div>
              </div>

              {/* ADRESSE DE LIVRAISON */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Adresse de livraison</h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Adresse"
                      value={paymentData.address}
                      onChange={(e) => setPaymentData({...paymentData, address: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        placeholder="Ville"
                        value={paymentData.city}
                        onChange={(e) => setPaymentData({...paymentData, city: e.target.value})}
                        className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Code postal"
                        value={paymentData.zipCode}
                        onChange={(e) => setPaymentData({...paymentData, zipCode: e.target.value.replace(/\D/g, '').substring(0, 5)})}
                        maxLength="5"
                        className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      />
                      {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* BOUTON DE PAIEMENT */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Traitement en cours...
                  </>
                ) : (
                  <>
                    <span>💳</span> Payer {total.toFixed(2)} €
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* RÉCAPITULATIF */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Récapitulatif</h2>
            
            <div className="space-y-3 mb-4">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium">{item.price} €</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span className="text-green-600 font-medium">Gratuite</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-gray-900 border-t pt-2 mt-2">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
              <p className="text-xs text-gray-600 text-center">
                🔒 Paiement sécurisé - Ceci est une simulation pour le projet BTS SIO
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;

