import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../axios-client.js';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Options de livraison
const SHIPPING_METHODS = [
  { id: 'standard', name: 'Livraison Standard', price: 4.99, delay: '3-5 jours', icon: '🚚' },
  { id: 'express', name: 'Chronopost Express', price: 12.99, delay: '24h', icon: '🚀' },
  { id: 'shop', name: 'Retrait en Magasin', price: 0, delay: 'Immédiat', icon: '🏪' }
];

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // États du tunnel
  const [step, setStep] = useState(1); // 1: Adresse, 2: Livraison, 3: Paiement
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Données du formulaire
  const [address, setAddress] = useState({ street: '', city: '', zip: '', country: 'France' });
  const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHODS[0]);
  const [paymentData, setPaymentData] = useState({ card: '', date: '', cvv: '', name: '' });

  // Calculs financiers
  const subtotal = cart.reduce((acc, item) => acc + Number(item.price || 0), 0);
  const total = subtotal + shippingMethod.price;

  // --- ACTIONS ---

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if(address.street && address.city && address.zip) setStep(2);
    else alert("Veuillez remplir tous les champs d'adresse.");
  };

  const handleShippingSubmit = () => {
    setStep(3);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if(paymentData.card.length < 16) return alert("Numéro de carte invalide");

    setIsProcessing(true);

    try {
      // Simulation API (2 secondes)
      await new Promise(resolve => setTimeout(resolve, 2000));

      const orderData = {
        cart: cart,
        total: total,
        address: address,
        shipping: shippingMethod,
        payment_method: 'credit_card'
      };

      // Envoi au backend
      const response = await axiosClient.post('/orders', orderData);
      
      alert(`✅ Commande #${response.data.id || Math.floor(Math.random()*10000)} validée ! Merci de votre achat.`);
      clearCart();
      navigate('/'); // Retour accueil (ou vers une page "Success" dédiée)
    } catch (error) {
      console.error(error);
      alert('❌ Erreur lors du paiement. Veuillez contacter votre banque.');
    } finally {
      setIsProcessing(false);
    }
  };

  // --- RENDU SI PANIER VIDE ---
  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Votre panier est vide</h2>
        <Link to="/" className="text-[#1D428A] font-bold hover:underline">Continuer mes achats</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      
      {/* HEADER TUNNEL */}
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center w-full max-w-2xl">
            {/* Étape 1 */}
            <div className={`flex flex-col items-center relative z-10 ${step >= 1 ? 'text-[#1D428A]' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-colors ${step >= 1 ? 'bg-[#1D428A] text-white border-[#1D428A]' : 'bg-white border-gray-300'}`}>1</div>
                <span className="text-xs font-bold mt-2 uppercase">Adresse</span>
            </div>
            <div className={`flex-1 h-1 mx-2 transition-colors ${step >= 2 ? 'bg-[#1D428A]' : 'bg-gray-200'}`}></div>
            
            {/* Étape 2 */}
            <div className={`flex flex-col items-center relative z-10 ${step >= 2 ? 'text-[#1D428A]' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-colors ${step >= 2 ? 'bg-[#1D428A] text-white border-[#1D428A]' : 'bg-white border-gray-300'}`}>2</div>
                <span className="text-xs font-bold mt-2 uppercase">Livraison</span>
            </div>
            <div className={`flex-1 h-1 mx-2 transition-colors ${step >= 3 ? 'bg-[#1D428A]' : 'bg-gray-200'}`}></div>

            {/* Étape 3 */}
            <div className={`flex flex-col items-center relative z-10 ${step >= 3 ? 'text-[#1D428A]' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-colors ${step >= 3 ? 'bg-[#1D428A] text-white border-[#1D428A]' : 'bg-white border-gray-300'}`}>3</div>
                <span className="text-xs font-bold mt-2 uppercase">Paiement</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- COLONNE GAUCHE : FORMULAIRES --- */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* ETAPE 1 : ADRESSE */}
            {step === 1 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-6 rounded shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span>📍</span> Adresse de livraison
                    </h2>
                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Prénom</label>
                                <input type="text" defaultValue={user.name?.split(' ')[0]} className="w-full border p-2 rounded bg-gray-50" readOnly />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Nom</label>
                                <input type="text" defaultValue={user.name?.split(' ')[1]} className="w-full border p-2 rounded bg-gray-50" readOnly />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Adresse</label>
                            <input 
                                type="text" required placeholder="123 Rue de la Tech" 
                                className="w-full border border-gray-300 p-2 rounded focus:border-[#1D428A] outline-none"
                                value={address.street} onChange={e => setAddress({...address, street: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Code Postal</label>
                                <input 
                                    type="text" required placeholder="75000" 
                                    className="w-full border border-gray-300 p-2 rounded focus:border-[#1D428A] outline-none"
                                    value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Ville</label>
                                <input 
                                    type="text" required placeholder="Paris" 
                                    className="w-full border border-gray-300 p-2 rounded focus:border-[#1D428A] outline-none"
                                    value={address.city} onChange={e => setAddress({...address, city: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="pt-4 flex justify-end">
                            <button className="bg-[#1D428A] text-white px-6 py-3 rounded font-bold hover:bg-[#15326d] transition shadow-lg">
                                Valider et continuer ▸
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {/* ETAPE 2 : LIVRAISON */}
            {step === 2 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-6 rounded shadow-sm border border-gray-200">
                    <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:underline mb-4">← Revenir à l'adresse</button>
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span>🚚</span> Mode de livraison
                    </h2>
                    <div className="space-y-3">
                        {SHIPPING_METHODS.map((method) => (
                            <label key={method.id} className={`flex items-center justify-between p-4 border rounded cursor-pointer transition ${shippingMethod.id === method.id ? 'border-[#1D428A] bg-blue-50 ring-1 ring-[#1D428A]' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="radio" name="shipping" 
                                        checked={shippingMethod.id === method.id}
                                        onChange={() => setShippingMethod(method)}
                                        className="w-5 h-5 text-[#1D428A]"
                                    />
                                    <div>
                                        <div className="font-bold text-gray-800 flex items-center gap-2">
                                            <span className="text-xl">{method.icon}</span> {method.name}
                                        </div>
                                        <div className="text-sm text-gray-500">Délai estimé : {method.delay}</div>
                                    </div>
                                </div>
                                <div className="font-bold text-[#1D428A]">
                                    {method.price === 0 ? 'GRATUIT' : `${method.price} €`}
                                </div>
                            </label>
                        ))}
                    </div>
                    <div className="pt-6 flex justify-end">
                        <button onClick={handleShippingSubmit} className="bg-[#1D428A] text-white px-6 py-3 rounded font-bold hover:bg-[#15326d] transition shadow-lg">
                            Passer au paiement ▸
                        </button>
                    </div>
                </motion.div>
            )}

            {/* ETAPE 3 : PAIEMENT */}
            {step === 3 && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-6 rounded shadow-sm border border-gray-200">
                    <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:underline mb-4">← Revenir à la livraison</button>
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span>💳</span> Paiement sécurisé
                    </h2>
                    
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm text-yellow-800 mb-6 flex items-center gap-2">
                        <span>🔒</span> Vous allez payer <strong>{total.toFixed(2)} €</strong> par Carte Bancaire.
                    </div>

                    <form onSubmit={handlePayment} className="space-y-4 max-w-md mx-auto">
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl text-white shadow-xl">
                            <div className="mb-4">
                                <label className="block text-xs uppercase opacity-70 mb-1">Numéro de carte</label>
                                <input 
                                    type="text" placeholder="0000 0000 0000 0000" maxLength="19" required
                                    className="w-full bg-transparent border-b border-white/30 text-xl tracking-widest placeholder-white/20 focus:outline-none focus:border-white py-1"
                                    value={paymentData.card}
                                    onChange={e => setPaymentData({...paymentData, card: e.target.value.replace(/\D/g,'')})}
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs uppercase opacity-70 mb-1">Expire fin</label>
                                    <input 
                                        type="text" placeholder="MM/AA" maxLength="5" required
                                        className="w-full bg-transparent border-b border-white/30 text-lg placeholder-white/20 focus:outline-none focus:border-white py-1"
                                        value={paymentData.date}
                                        onChange={e => setPaymentData({...paymentData, date: e.target.value})}
                                    />
                                </div>
                                <div className="w-20">
                                    <label className="block text-xs uppercase opacity-70 mb-1">CVV</label>
                                    <input 
                                        type="text" placeholder="123" maxLength="3" required
                                        className="w-full bg-transparent border-b border-white/30 text-lg placeholder-white/20 focus:outline-none focus:border-white py-1"
                                        value={paymentData.cvv}
                                        onChange={e => setPaymentData({...paymentData, cvv: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <label className="block text-xs uppercase opacity-70 mb-1">Titulaire</label>
                                <input 
                                    type="text" placeholder="NOM PRENOM" required
                                    className="w-full bg-transparent border-b border-white/30 text-lg placeholder-white/20 focus:outline-none focus:border-white py-1 uppercase"
                                    value={paymentData.name}
                                    onChange={e => setPaymentData({...paymentData, name: e.target.value})}
                                />
                            </div>
                        </div>

                        <button 
                            disabled={isProcessing}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg shadow-lg transition transform hover:scale-[1.02] flex justify-center items-center gap-2 mt-6"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Traitement...
                                </>
                            ) : (
                                <>Payer {total.toFixed(2)} €</>
                            )}
                        </button>
                    </form>
                </motion.div>
            )}

        </div>

        {/* --- COLONNE DROITE : RÉCAPITULATIF (Sticky) --- */}
        <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded shadow-sm p-6 sticky top-32">
                <h3 className="font-bold text-gray-800 text-lg border-b pb-2 mb-4">Récapitulatif</h3>
                
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                    {cart.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                            <span className="text-gray-600 truncate w-2/3" title={item.name}>{item.name}</span>
                            <span className="font-bold">{item.price} €</span>
                        </div>
                    ))}
                </div>

                <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                        <span>Sous-total</span>
                        <span>{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Livraison</span>
                        <span>{shippingMethod.price === 0 ? 'Gratuite' : `${shippingMethod.price} €`}</span>
                    </div>
                    <div className="text-xs text-gray-400 italic text-right">{shippingMethod.name}</div>
                </div>

                <div className="border-t mt-4 pt-4 flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-800">Total TTC</span>
                    <span className="font-black text-2xl text-[#1D428A]">{total.toFixed(2)} €</span>
                </div>

                <div className="mt-6 bg-blue-50 p-3 rounded text-xs text-blue-800 flex items-start gap-2">
                    <span className="text-xl">🛡️</span>
                    <p>Paiement 100% sécurisé via protocole SSL. Vos données bancaires sont cryptées.</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}