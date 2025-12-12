import { useState, useEffect } from 'react';
import axiosClient from '../axios-client.js';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPOSANTS UI ---
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-black text-gray-800">{value}</h3>
    </div>
    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${color}`}>
      {icon}
    </div>
  </div>
);

const Badge = ({ children, color }) => (
  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${color}`}>
    {children}
  </span>
);

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  
  // Modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  
  // Selection
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Formulaires
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', stock: '', image_url: '' });

  const navigate = useNavigate();
  const storageUrl = `${import.meta.env.VITE_API_BASE_URL}/storage/`;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') navigate('/');
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, oRes, uRes] = await Promise.all([
        axiosClient.get('/products'),
        axiosClient.get('/admin/orders'),
        axiosClient.get('/users')
      ]);
      setProducts(pRes.data);
      setOrders(oRes.data);
      setUsers(uRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  // --- LOGIQUE PRODUITS ---
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const payload = { ...productForm };
    
    // Si c'est une édition
    if (editingProduct) {
        axiosClient.put(`/admin/products/${editingProduct.id}`, payload)
            .then(() => { alert("Produit modifié"); closeProductModal(); fetchData(); })
            .catch(err => alert("Erreur modification"));
    } else {
        // Création
        axiosClient.post('/admin/products', payload)
            .then(() => { alert("Produit créé"); closeProductModal(); fetchData(); })
            .catch(err => alert("Erreur création"));
    }
  };

  const deleteProduct = (id) => {
    if(confirm("Supprimer ce produit ?")) {
        axiosClient.delete(`/admin/products/${id}`).then(fetchData);
    }
  };

  const openProductModal = (product = null) => {
    setEditingProduct(product);
    setProductForm(product || { name: '', description: '', price: '', stock: '', image_url: '' });
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // --- LOGIQUE COMMANDES ---
  const updateOrderStatus = (id, status) => {
    axiosClient.put(`/admin/orders/${id}/status`, { status })
      .then(() => {
        fetchData();
        // Mettre à jour l'ordre sélectionné si ouvert
        if (selectedOrder && selectedOrder.id === id) {
            setSelectedOrder({ ...selectedOrder, status });
        }
      });
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };

  // Helper pour parser le contenu JSON du panier
  const getOrderItems = (content) => {
    try {
        return typeof content === 'string' ? JSON.parse(content) : content;
    } catch { return []; }
  };

  // Stats
  const revenue = orders.reduce((acc, o) => acc + Number(o.total_price), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans overflow-hidden">
      
      {/* SIDEBAR NOIRE (Style Dashboard Pro) */}
      <aside className="w-64 bg-[#1e293b] text-white flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-700">
            <span className="font-black text-xl tracking-tight text-white">ADMIN<span className="text-blue-400">PANEL</span></span>
        </div>

        <nav className="flex-1 py-6 space-y-1">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center px-6 py-3 hover:bg-gray-700 transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white border-r-4 border-blue-300' : 'text-gray-400'}`}>
                <span className="mr-3">📊</span> Vue d'ensemble
            </button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center px-6 py-3 hover:bg-gray-700 transition ${activeTab === 'orders' ? 'bg-blue-600 text-white border-r-4 border-blue-300' : 'text-gray-400'}`}>
                <span className="mr-3">📦</span> Commandes <span className="ml-auto bg-red-500 text-white text-[10px] px-2 rounded-full">{pendingOrders}</span>
            </button>
            <button onClick={() => setActiveTab('products')} className={`w-full flex items-center px-6 py-3 hover:bg-gray-700 transition ${activeTab === 'products' ? 'bg-blue-600 text-white border-r-4 border-blue-300' : 'text-gray-400'}`}>
                <span className="mr-3">🏷️</span> Produits
            </button>
            <button onClick={() => setActiveTab('users')} className={`w-full flex items-center px-6 py-3 hover:bg-gray-700 transition ${activeTab === 'users' ? 'bg-blue-600 text-white border-r-4 border-blue-300' : 'text-gray-400'}`}>
                <span className="mr-3">👥</span> Clients
            </button>
        </nav>

        <div className="p-4 border-t border-gray-700">
            <button onClick={() => navigate('/')} className="w-full text-sm text-gray-400 hover:text-white flex items-center gap-2">
                <span>← Retour au site</span>
            </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Chiffre d'affaires" value={`${revenue.toFixed(2)} €`} icon="💰" color="bg-green-500" />
                    <StatCard title="Commandes" value={orders.length} icon="🛍️" color="bg-blue-500" />
                    <StatCard title="Produits" value={products.length} icon="📦" color="bg-purple-500" />
                    <StatCard title="Clients" value={users.length} icon="👤" color="bg-orange-500" />
                </div>

                <div className="bg-white rounded shadow-sm border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-700 mb-4">Dernières commandes</h3>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Client</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Total</th>
                                <th className="p-3">Statut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.slice(0, 5).map(o => (
                                <tr key={o.id}>
                                    <td className="p-3 font-mono">#{o.id}</td>
                                    <td className="p-3 font-bold">{o.user ? o.user.name : 'Invité'}</td>
                                    <td className="p-3">{new Date(o.created_at).toLocaleDateString()}</td>
                                    <td className="p-3">{o.total_price} €</td>
                                    <td className="p-3">
                                        <Badge color={o.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                                            {o.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Gestion du Catalogue</h1>
                    <button onClick={() => openProductModal()} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition flex items-center gap-2">
                        <span>+</span> Ajouter un produit
                    </button>
                </div>

                <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-200">
                            <tr>
                                <th className="p-4 w-20">Image</th>
                                <th className="p-4">Nom</th>
                                <th className="p-4">Prix</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden border">
                                            {p.image_path ? (
                                                <img src={p.image_path.startsWith('http') ? p.image_path : storageUrl + p.image_path} className="w-full h-full object-cover" />
                                            ) : '📷'}
                                        </div>
                                    </td>
                                    <td className="p-4 font-medium text-gray-900">{p.name}</td>
                                    <td className="p-4 font-bold text-blue-600">{p.price} €</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs ${p.stock < 5 ? 'bg-red-100 text-red-700 font-bold' : 'bg-gray-100 text-gray-600'}`}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => openProductModal(p)} className="text-blue-600 hover:underline">Modifier</button>
                                        <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:underline">Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Suivi des Commandes</h1>
                <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-200">
                            <tr>
                                <th className="p-4">Réf</th>
                                <th className="p-4">Client</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Statut</th>
                                <th className="p-4 text-right">Détails</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map(o => (
                                <tr key={o.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-mono text-gray-500">#{o.id}</td>
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900">{o.user ? o.user.name : 'Client Supprimé'}</div>
                                        <div className="text-xs text-gray-500">{o.user ? o.user.email : ''}</div>
                                    </td>
                                    <td className="p-4">{new Date(o.created_at).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold">{o.total_price} €</td>
                                    <td className="p-4">
                                        <select 
                                            value={o.status} 
                                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                            className={`border rounded px-2 py-1 text-xs font-bold uppercase cursor-pointer outline-none ${
                                                o.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' : 
                                                o.status === 'shipped' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                                'bg-yellow-100 text-yellow-800 border-yellow-200'
                                            }`}
                                        >
                                            <option value="pending">En attente</option>
                                            <option value="processing">Préparation</option>
                                            <option value="shipped">Expédié</option>
                                            <option value="delivered">Livré</option>
                                            <option value="cancelled">Annulé</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => openOrderDetails(o)} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs font-bold transition">
                                            Voir détails
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </main>

      {/* MODAL PRODUIT (AJOUT/EDITION) */}
      <AnimatePresence>
        {isProductModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                    <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Modifier le produit' : 'Nouveau produit'}</h2>
                    <form onSubmit={handleSaveProduct} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Nom</label>
                            <input className="w-full border p-2 rounded" value={productForm.name} onChange={e=>setProductForm({...productForm, name: e.target.value})} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Prix</label>
                                <input type="number" step="0.01" className="w-full border p-2 rounded" value={productForm.price} onChange={e=>setProductForm({...productForm, price: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Stock</label>
                                <input type="number" className="w-full border p-2 rounded" value={productForm.stock} onChange={e=>setProductForm({...productForm, stock: e.target.value})} required />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">URL Image (ou chemin)</label>
                            <input className="w-full border p-2 rounded" value={productForm.image_url || ''} onChange={e=>setProductForm({...productForm, image_url: e.target.value})} placeholder="https://..." />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Description</label>
                            <textarea className="w-full border p-2 rounded" rows="3" value={productForm.description} onChange={e=>setProductForm({...productForm, description: e.target.value})} />
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <button type="button" onClick={closeProductModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Annuler</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Enregistrer</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* MODAL DETAILS COMMANDE */}
      <AnimatePresence>
        {isOrderDetailsOpen && selectedOrder && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} exit={{y:20, opacity:0}} className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                    {/* Header Modal */}
                    <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Commande #{selectedOrder.id}</h2>
                            <p className="text-sm text-gray-500">Du {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => setIsOrderDetailsOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                    
                    {/* Body Modal */}
                    <div className="p-6 overflow-y-auto">
                        
                        {/* Info Client & Livraison */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="bg-blue-50 p-4 rounded border border-blue-100">
                                <h3 className="font-bold text-blue-800 text-sm mb-2 uppercase">Client</h3>
                                <p className="font-bold">{selectedOrder.user?.name}</p>
                                <p className="text-sm">{selectedOrder.user?.email}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded border border-gray-200">
                                <h3 className="font-bold text-gray-700 text-sm mb-2 uppercase">Livraison</h3>
                                {/* Ici on simule l'adresse si elle n'est pas stockée en base, sinon on l'afficherait */}
                                <p className="text-sm text-gray-600">
                                    {selectedOrder.address_json ? JSON.parse(selectedOrder.address_json).street : "123 Rue de l'Exemple"} <br/>
                                    {selectedOrder.address_json ? JSON.parse(selectedOrder.address_json).zip : "75000"} Paris
                                </p>
                            </div>
                        </div>

                        {/* Liste Produits */}
                        <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">Contenu du colis</h3>
                        <div className="space-y-3">
                            {getOrderItems(selectedOrder.content).map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center text-xs">
                                            {item.image_path ? <img src={item.image_path.startsWith('http') ? item.image_path : storageUrl + item.image_path} className="max-h-full" /> : '📷'}
                                        </div>
                                        <span className="font-medium text-gray-700">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-gray-900">{item.price} €</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer Modal */}
                    <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
                        <div>
                            <span className="text-gray-500 text-sm">Statut actuel: </span>
                            <span className="font-bold uppercase text-blue-600">{selectedOrder.status}</span>
                        </div>
                        <div className="text-xl font-black text-gray-800">
                            Total: {selectedOrder.total_price} €
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </div>
  );
}