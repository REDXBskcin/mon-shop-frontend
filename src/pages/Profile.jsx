import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function Profile() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState({ name: '', email: '', password: '', role: '' });
  const [orders, setOrders] = useState([]);
  
  const token = localStorage.getItem('token');
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };
  const storageUrl = "http://127.0.0.1:8000/storage/";

  useEffect(() => {
    // Récupérer les commandes
    axios.get('http://127.0.0.1:8000/api/my-orders', axiosConfig)
      .then(res => setOrders(res.data))
      .catch(err => console.error(err));
      
    // Simuler récupération infos user (normalement via endpoint /me)
    const storedRole = localStorage.getItem('role');
    // Ici on utilise les infos qu'on a déjà ou on pourrait faire un appel API
    // Pour l'exemple, on laisse les champs vides à remplir par l'user pour modif
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put('http://127.0.0.1:8000/api/profile', user, axiosConfig)
      .then(res => {
        alert("Profil mis à jour avec succès !");
        setUser({...user, password: ''}); // Reset mdp
      })
      .catch(err => alert("Erreur lors de la mise à jour."));
  };

  // Calculs statistiques
  const totalSpent = orders.reduce((acc, order) => acc + Number(order.total_price), 0);
  const lastOrderDate = orders.length > 0 ? new Date(orders[0].created_at).toLocaleDateString() : 'Aucune';

  // Helper pour parser le contenu de la commande (JSON string -> Array)
  const getOrderItems = (jsonContent) => {
    try {
        return JSON.parse(jsonContent);
    } catch (e) {
        return [];
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      
      {/* EN-TÊTE PROFIL */}
      <div className="flex items-center gap-6 mb-10 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <img 
            src={`https://ui-avatars.com/api/?name=${user.name || 'User'}&background=6366f1&color=fff&size=128`} 
            alt="Avatar" 
            className="w-24 h-24 rounded-full border-4 border-indigo-50 shadow-md"
        />
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Espace Client</h1>
            <p className="text-gray-500">Gérez vos commandes et vos informations personnelles.</p>
            <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">Compte Actif</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="lg:col-span-1 space-y-2">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-6 py-4 rounded-xl font-medium transition flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                <span>📊</span> Vue d'ensemble
            </button>
            <button onClick={() => setActiveTab('orders')} className={`w-full text-left px-6 py-4 rounded-xl font-medium transition flex items-center gap-3 ${activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                <span>📦</span> Mes Commandes
            </button>
            <button onClick={() => setActiveTab('settings')} className={`w-full text-left px-6 py-4 rounded-xl font-medium transition flex items-center gap-3 ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-600 hover:bg-gray-50'}`}>
                <span>⚙️</span> Paramètres
            </button>
        </div>

        {/* CONTENU PRINCIPAL */}
        <div className="lg:col-span-3">
            
            {/* VUE DASHBOARD */}
            {activeTab === 'dashboard' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-gray-500 text-sm mb-1">Total Dépensé</p>
                            <p className="text-3xl font-bold text-gray-900">{totalSpent.toFixed(2)} €</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-gray-500 text-sm mb-1">Commandes</p>
                            <p className="text-3xl font-bold text-indigo-600">{orders.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <p className="text-gray-500 text-sm mb-1">Dernière commande</p>
                            <p className="text-xl font-bold text-gray-800">{lastOrderDate}</p>
                        </div>
                    </div>
                    
                    {/* Dernière commande aperçu */}
                    {orders.length > 0 && (
                        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                            <h3 className="font-bold text-indigo-900 mb-2">Dernière activité</h3>
                            <p className="text-indigo-700">Votre commande du {new Date(orders[0].created_at).toLocaleDateString()} est bien enregistrée.</p>
                        </div>
                    )}
                </div>
            )}

            {/* VUE COMMANDES */}
            {activeTab === 'orders' && (
                <div className="space-y-6">
                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                            <p className="text-gray-400 mb-4 text-4xl">📭</p>
                            <p className="text-gray-500">Vous n'avez pas encore passé de commande.</p>
                        </div>
                    ) : (
                        orders.map(order => {
                            const items = getOrderItems(order.content);
                            return (
                                <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-b border-gray-100">
                                        <div>
                                            <span className="font-bold text-gray-900">Commande #{order.id}</span>
                                            <span className="text-gray-500 text-sm ml-3">{new Date(order.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Payée</span>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4 mb-4">
                                            {items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4">
                                                    <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
                                                        {item.image_path ? (
                                                            <img src={storageUrl + item.image_path} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <span className="text-xs text-gray-400">img</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">{item.name}</p>
                                                        <p className="text-sm text-gray-500">{item.price} €</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="border-t pt-4 flex justify-between items-center">
                                            <span className="text-gray-500">Total payé</span>
                                            <span className="text-xl font-bold text-indigo-600">{order.total_price} €</span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            )}

            {/* VUE SETTINGS */}
            {activeTab === 'settings' && (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Modifier mes informations</h2>
                    <form onSubmit={handleUpdate} className="space-y-6 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                            <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                                placeholder="Votre nom"
                                value={user.name} onChange={e => setUser({...user, name: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                                placeholder="Votre email"
                                value={user.email} onChange={e => setUser({...user, email: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                            <input type="password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                                placeholder="Laisser vide si inchangé"
                                onChange={e => setUser({...user, password: e.target.value})}
                            />
                        </div>
                        <div className="pt-4">
                            <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-600 transition w-full md:w-auto">
                                Sauvegarder les modifications
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}

export default Profile;