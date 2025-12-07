import { useState, useEffect } from 'react';
import axiosClient from '../../axios-client.js'; // Import de notre configuration axios centralisée

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Formulaire
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [image, setImage] = useState(null);

    // Charger les produits au lancement
    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        axiosClient.get('/admin/products')
            .then(({ data }) => setProducts(data))
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;
        
        axiosClient.delete(`/admin/products/${id}`)
            .then(() => {
                alert("Produit supprimé !");
                loadProducts();
            })
            .catch(err => alert("Erreur lors de la suppression"));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('stock', stock);
        if (image) {
            formData.append('image', image);
        }

        axiosClient.post('/admin/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(() => {
            alert("Produit ajouté avec succès !");
            // Reset du formulaire
            setName(''); setDescription(''); setPrice(''); setStock(''); setImage(null);
            loadProducts();
        })
        .catch(err => {
            console.error(err);
            alert("Erreur lors de l'ajout.");
        })
        .finally(() => setLoading(false));
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">📦 Gestion des Produits</h1>

            {/* FORMULAIRE D'AJOUT */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold mb-4">Ajouter un nouveau produit</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Nom du produit" value={name} onChange={e=>setName(e.target.value)} className="border p-2 rounded" required />
                    <input type="number" placeholder="Prix (€)" value={price} onChange={e=>setPrice(e.target.value)} className="border p-2 rounded" required />
                    <input type="number" placeholder="Stock" value={stock} onChange={e=>setStock(e.target.value)} className="border p-2 rounded" required />
                    <input type="file" onChange={e=>setImage(e.target.files[0])} className="border p-2 rounded bg-gray-50" />
                    <textarea placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} className="border p-2 rounded md:col-span-2" rows="3" required></textarea>
                    
                    <button type="submit" disabled={loading} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700 md:col-span-2 transition">
                        {loading ? 'Envoi en cours...' : 'Ajouter le produit'}
                    </button>
                </form>
            </div>

            {/* LISTE DES PRODUITS */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Nom</th>
                            <th className="p-4">Prix</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 text-gray-500">#{product.id}</td>
                                <td className="p-4 font-bold">{product.name}</td>
                                <td className="p-4 text-green-600 font-bold">{product.price} €</td>
                                <td className="p-4">{product.stock}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => handleDelete(product.id)} className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200 transition">
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}