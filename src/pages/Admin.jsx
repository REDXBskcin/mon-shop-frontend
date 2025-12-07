import { useState, useEffect } from 'react';
import axiosClient from '../axios-client.js';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPOSANT STATS ---
const StatCard = ({ title, value, icon, trend, color }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
      <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-gray-400'} flex items-center gap-1 mt-2`}>
        {trend === 'up' ? '↗ Hausse' : '— Stable'}
      </span>
    </div>
    <div className={`p-3 rounded-lg ${color} text-white shadow-lg`}>{icon}</div>
  </div>
);

function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  
  // États pour les modals
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null = création, sinon = édition
  
  // États pour les formulaires
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', stock: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [useImageUrl, setUseImageUrl] = useState(false); // true = URL, false = fichier
  const [orderForm, setOrderForm] = useState({ status: 'pending' });
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'user', password: '' });

  const navigate = useNavigate();
  const storageUrl = `${import.meta.env.VITE_API_BASE_URL}/storage`;

  // Vérification de l'accès admin
  useEffect(() => {
    const token = localStorage.getItem('token');
    let role = localStorage.getItem('role');
    if (role) role = role.trim();
    if (!token || role !== 'admin') navigate('/');
    else fetchData();
  }, []);

  // Chargement des données
  const fetchData = () => {
    axiosClient.get('/products').then(res => setProducts(res.data));
    axiosClient.get('/admin/orders').then(res => setOrders(res.data));
    axiosClient.get('/users').then(res => setUsers(res.data));
  };

  // ============================================
  // GESTION DES PRODUITS
  // ============================================
  const openProductModal = (product = null) => {
    if (product) {
      // Mode édition
      setEditingItem(product);
      setProductForm({
        name: String(product.name || ''),
        description: String(product.description || ''),
        price: product.price != null ? String(product.price) : '',
        stock: product.stock != null ? String(product.stock) : ''
      });
      setImageFile(null);
      // Vérifier si l'image actuelle est une URL
      const isUrl = product.image_path && product.image_path.startsWith('http');
      setUseImageUrl(isUrl);
      setImageUrl(isUrl ? String(product.image_path) : '');
    } else {
      // Mode création
      setEditingItem(null);
      setProductForm({ name: '', description: '', price: '', stock: '' });
      setImageFile(null);
      setImageUrl('');
      setUseImageUrl(false);
    }
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    
    if (useImageUrl && imageUrl) {
      // Validation de l'URL
      try {
        new URL(imageUrl);
      } catch {
        alert("L'URL de l'image n'est pas valide. Veuillez entrer une URL complète (ex: https://exemple.com/image.jpg)");
        return;
      }
      
      if (imageUrl.length > 500) {
        alert("L'URL de l'image est trop longue (maximum 500 caractères). Veuillez utiliser une URL plus courte ou uploader un fichier.");
        return;
      }
      
      // Utilisation d'une URL d'image
      const data = {
        name: productForm.name,
        description: productForm.description,
        price: productForm.price,
        stock: productForm.stock,
        image_url: imageUrl
      };

      if (editingItem) {
        // Modification
        axiosClient.put(`/admin/products/${editingItem.id}`, data)
          .then(() => {
            alert('Produit modifié avec succès !');
            setIsProductModalOpen(false);
            fetchData();
          })
          .catch(err => {
            const errorMessage = err.response?.data?.message || 
                                err.response?.data?.errors?.image_url?.[0] || 
                                "Erreur lors de la modification";
            alert(errorMessage);
          });
      } else {
        // Création
        axiosClient.post('/admin/products', data)
          .then(() => {
            alert('Produit ajouté avec succès !');
            setIsProductModalOpen(false);
            fetchData();
          })
          .catch(err => {
            const errorMessage = err.response?.data?.message || 
                                err.response?.data?.errors?.image_url?.[0] || 
                                "Erreur lors de l'ajout";
            alert(errorMessage);
          });
      }
    } else if (imageFile) {
      // Utilisation d'un fichier uploadé
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('stock', productForm.stock);
      formData.append('image', imageFile);

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (editingItem) {
        // Modification
        axiosClient.put(`/admin/products/${editingItem.id}`, formData, config)
          .then(() => {
            alert('Produit modifié avec succès !');
            setIsProductModalOpen(false);
            fetchData();
          })
          .catch(err => {
            const errorMessage = err.response?.data?.message || 
                                err.response?.data?.errors?.image?.[0] || 
                                "Erreur lors de la modification";
            alert(errorMessage);
          });
      } else {
        // Création
        axiosClient.post('/admin/products', formData, config)
          .then(() => {
            alert('Produit ajouté avec succès !');
            setIsProductModalOpen(false);
            fetchData();
          })
          .catch(err => {
            const errorMessage = err.response?.data?.message || 
                                err.response?.data?.errors?.image?.[0] || 
                                "Erreur lors de l'ajout";
            alert(errorMessage);
          });
      }
    } else {
      // Aucune image fournie
      const data = {
        name: productForm.name,
        description: productForm.description,
        price: productForm.price,
        stock: productForm.stock
      };

      if (editingItem) {
        // Modification
        axiosClient.put(`/admin/products/${editingItem.id}`, data)
          .then(() => {
            alert('Produit modifié avec succès !');
            setIsProductModalOpen(false);
            fetchData();
          })
          .catch(err => {
            const errorMessage = err.response?.data?.message || 
                                "Erreur lors de la modification";
            alert(errorMessage);
          });
      } else {
        // Création
        axiosClient.post('/admin/products', data)
          .then(() => {
            alert('Produit ajouté avec succès !');
            setIsProductModalOpen(false);
            fetchData();
          })
          .catch(err => {
            const errorMessage = err.response?.data?.message || 
                                "Erreur lors de l'ajout";
            alert(errorMessage);
          });
      }
    }
  };

  const handleDeleteProduct = (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      axiosClient.delete(`/admin/products/${id}`)
        .then(() => {
          alert('Produit supprimé !');
          fetchData();
        })
        .catch(err => alert("Erreur lors de la suppression"));
    }
  };

  // ============================================
  // GESTION DES COMMANDES
  // ============================================
  const openOrderModal = (order = null) => {
    if (order) {
      setEditingItem(order);
      setOrderForm({ status: order.status || 'pending' });
    } else {
      setEditingItem(null);
      setOrderForm({ status: 'pending' });
    }
    setIsOrderModalOpen(true);
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    axiosClient.put(`/admin/orders/${editingItem.id}/status`, { status: orderForm.status })
      .then(() => {
        alert('Statut de la commande mis à jour !');
        setIsOrderModalOpen(false);
        fetchData();
      })
      .catch(err => alert("Erreur lors de la mise à jour"));
  };

  const handleDeleteOrder = (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette commande ?")) {
      axiosClient.delete(`/admin/orders/${id}`)
        .then(() => {
          alert('Commande supprimée !');
          fetchData();
        })
        .catch(err => alert("Erreur lors de la suppression"));
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return `px-2 py-1 rounded-full text-xs font-bold uppercase ${colors[status] || 'bg-gray-100'}`;
  };

  // ============================================
  // GESTION DES UTILISATEURS
  // ============================================
  const openUserModal = (user = null) => {
    if (user) {
      setEditingItem(user);
      setUserForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'user',
        password: '' // On ne pré-remplit jamais le mot de passe
      });
    } else {
      setEditingItem(null);
      setUserForm({ name: '', email: '', role: 'user', password: '' });
    }
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    const data = { ...userForm };
    if (!data.password) delete data.password; // On n'envoie le mot de passe que s'il est rempli

    if (editingItem) {
      // Modification
      axiosClient.put(`/users/${editingItem.id}`, data)
        .then(() => {
          alert('Utilisateur modifié avec succès !');
          setIsUserModalOpen(false);
          fetchData();
        })
        .catch(err => alert("Erreur lors de la modification"));
    } else {
      // Création (via register)
      axiosClient.post('/register', { ...data, password: data.password || 'password123' })
        .then(() => {
          alert('Utilisateur créé avec succès !');
          setIsUserModalOpen(false);
          fetchData();
        })
        .catch(err => alert("Erreur lors de la création"));
    }
  };

  const handleDeleteUser = (id) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      axiosClient.delete(`/users/${id}`)
        .then(() => {
          alert('Utilisateur supprimé !');
          fetchData();
        })
        .catch(err => alert("Erreur lors de la suppression"));
    }
  };

  const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total_price || 0), 0);

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-gray-50 font-sans text-gray-900 overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Menu Gestion</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', icon: '📊', label: 'Vue d\'ensemble' },
            { id: 'products', icon: '📦', label: 'Produits' },
            { id: 'orders', icon: '🛒', label: 'Commandes' },
            { id: 'users', icon: '👥', label: 'Utilisateurs' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* --- CONTENU PRINCIPAL --- */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800 capitalize">
              {activeTab === 'dashboard' ? 'Tableau de bord' : activeTab}
            </h2>
            <p className="text-xs text-gray-500">Aperçu en temps réel</p>
          </div>
          {/* Boutons d'action contextuels */}
          {activeTab === 'products' && (
            <button 
              onClick={() => openProductModal()} 
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
            >
              <span>+</span> Ajouter
            </button>
          )}
          {activeTab === 'users' && (
            <button 
              onClick={() => openUserModal()} 
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-sm flex items-center gap-2"
            >
              <span>+</span> Ajouter
            </button>
          )}
        </header>

        {/* ZONE DE CONTENU */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          
          {/* VUE DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Revenu" value={`${totalRevenue.toFixed(2)} €`} icon="💰" trend="up" color="bg-emerald-500" />
                <StatCard title="Commandes" value={orders.length} icon="📦" trend="up" color="bg-blue-500" />
                <StatCard title="Produits" value={products.length} icon="🏷️" trend="neutral" color="bg-purple-500" />
                <StatCard title="Clients" value={users.length} icon="👤" trend="up" color="bg-orange-500" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 font-bold text-gray-700">Dernières Commandes</div>
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500">
                      <tr>
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Client</th>
                        <th className="px-6 py-3 text-right">Montant</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3 font-medium text-indigo-600">#{o.id}</td>
                          <td className="px-6 py-3">{o.user ? o.user.name : 'Invité'}</td>
                          <td className="px-6 py-3 text-right font-bold">{o.total_price} €</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 font-bold text-gray-700">État du Stock</div>
                  <div className="p-0">
                    {products.length === 0 ? (
                      <p className="p-6 text-gray-400">Aucun produit</p>
                    ) : (
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500">
                          <tr>
                            <th className="px-6 py-3">Produit</th>
                            <th className="px-6 py-3 text-right">Stock</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {products.slice(0, 5).map(p => (
                            <tr key={p.id}>
                              <td className="px-6 py-3 font-medium">{p.name}</td>
                              <td className="px-6 py-3 text-right">
                                <span className={`px-2 py-1 rounded-full text-xs ${p.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                  {p.stock}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VUE PRODUITS */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden max-w-6xl mx-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 w-16">Img</th>
                    <th className="px-6 py-4">Nom</th>
                    <th className="px-6 py-4">Prix</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 group">
                                    <td className="px-6 py-2">
                        <div className="w-10 h-10 rounded bg-gray-100 border flex items-center justify-center overflow-hidden">
                          {p.image_path ? (
                            <img 
                              src={p.image_path.startsWith('http') ? p.image_path : storageUrl + p.image_path} 
                              className="w-full h-full object-cover" 
                              alt={p.name}
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '📷';
                              }}
                            />
                          ) : (
                            '📷'
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-2 font-medium text-gray-900">{p.name}</td>
                      <td className="px-6 py-2 font-bold text-indigo-600">{p.price} €</td>
                      <td className="px-6 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${p.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-600'}`}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="px-6 py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openProductModal(p)} 
                            className="text-indigo-600 hover:text-indigo-800 p-1.5 hover:bg-indigo-50 rounded transition"
                            title="Modifier"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p.id)} 
                            className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* VUE COMMANDES */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden max-w-6xl mx-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-bold text-indigo-600">#{o.id}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{o.user ? o.user.name : 'Invité'}</div>
                        <div className="text-xs text-gray-500">{o.user ? o.user.email : ''}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-bold">{o.total_price} €</td>
                      <td className="px-6 py-4">
                        <span className={getStatusBadge(o.status || 'pending')}>
                          {o.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openOrderModal(o)} 
                            className="text-indigo-600 hover:text-indigo-800 p-1.5 hover:bg-indigo-50 rounded transition"
                            title="Modifier le statut"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={() => handleDeleteOrder(o.id)} 
                            className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition"
                            title="Supprimer"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* VUE USERS */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden max-w-6xl mx-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-4">Nom</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Rôle</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium">{u.name}</td>
                      <td className="px-6 py-4 text-gray-500">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openUserModal(u)} 
                            className="text-indigo-600 hover:text-indigo-800 p-1.5 hover:bg-indigo-50 rounded transition"
                            title="Modifier"
                          >
                            ✏️
                          </button>
                          {u.role !== 'admin' && (
                            <button 
                              onClick={() => handleDeleteUser(u.id)} 
                              className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition"
                              title="Supprimer"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </main>
      </div>

      {/* MODAL PRODUIT */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div 
              initial={{opacity:0, scale:0.95}} 
              animate={{opacity:1, scale:1}} 
              exit={{opacity:0, scale:0.95}} 
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                  {editingItem ? 'Modifier le produit' : 'Ajouter un produit'}
                </h3>
                <button 
                  onClick={() => setIsProductModalOpen(false)} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                {/* Choix entre fichier ou URL */}
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setUseImageUrl(false)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      !useImageUrl 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    📁 Upload fichier
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseImageUrl(true)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                      useImageUrl 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    🔗 URL image
                  </button>
                </div>
                
                {useImageUrl ? (
                  <input 
                    type="url" 
                    placeholder="https://exemple.com/image.jpg"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <input 
                    type="file" 
                    onChange={(e) => setImageFile(e.target.files[0])} 
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border rounded-lg"
                  />
                )}
                <input 
                  className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Nom" 
                  value={productForm.name} 
                  onChange={e => setProductForm({...productForm, name: e.target.value})} 
                  required
                />
                <textarea 
                  className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Description" 
                  value={productForm.description} 
                  onChange={e => setProductForm({...productForm, description: e.target.value})} 
                  rows="3"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                    type="number" 
                    step="0.01"
                    placeholder="Prix" 
                    value={productForm.price} 
                    onChange={e => setProductForm({...productForm, price: e.target.value})} 
                    required
                  />
                  <input 
                    className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                    type="number" 
                    placeholder="Stock" 
                    value={productForm.stock} 
                    onChange={e => setProductForm({...productForm, stock: e.target.value})} 
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition"
                >
                  {editingItem ? 'Modifier' : 'Ajouter'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL COMMANDE */}
      <AnimatePresence>
        {isOrderModalOpen && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div 
              initial={{opacity:0, scale:0.95}} 
              animate={{opacity:1, scale:1}} 
              exit={{opacity:0, scale:0.95}} 
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Modifier le statut de la commande #{editingItem.id}</h3>
                <button 
                  onClick={() => setIsOrderModalOpen(false)} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <select 
                    value={orderForm.status} 
                    onChange={e => setOrderForm({status: e.target.value})}
                    className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="pending">En attente</option>
                    <option value="processing">En cours</option>
                    <option value="shipped">Expédié</option>
                    <option value="delivered">Livré</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition"
                >
                  Modifier
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL UTILISATEUR */}
      <AnimatePresence>
        {isUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div 
              initial={{opacity:0, scale:0.95}} 
              animate={{opacity:1, scale:1}} 
              exit={{opacity:0, scale:0.95}} 
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                  {editingItem ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
                </h3>
                <button 
                  onClick={() => setIsUserModalOpen(false)} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleUserSubmit} className="space-y-4">
                <input 
                  className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Nom" 
                  value={userForm.name} 
                  onChange={e => setUserForm({...userForm, name: e.target.value})} 
                  required
                />
                <input 
                  className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                  type="email"
                  placeholder="Email" 
                  value={userForm.email} 
                  onChange={e => setUserForm({...userForm, email: e.target.value})} 
                  required
                />
                <select 
                  value={userForm.role} 
                  onChange={e => setUserForm({...userForm, role: e.target.value})}
                  className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
                <input 
                  className="w-full border p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                  type="password"
                  placeholder={editingItem ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"} 
                  value={userForm.password} 
                  onChange={e => setUserForm({...userForm, password: e.target.value})} 
                  required={!editingItem}
                />
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition"
                >
                  {editingItem ? 'Modifier' : 'Ajouter'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Admin;
