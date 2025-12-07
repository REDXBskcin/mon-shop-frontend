import { useState, useEffect } from 'react';
import axiosClient from '../../axios-client.js';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        axiosClient.get('/admin/orders')
            .then(({ data }) => setOrders(data))
            .catch(err => console.error(err));
    };

    const updateStatus = (id, newStatus) => {
        axiosClient.put(`/admin/orders/${id}/status`, { status: newStatus })
            .then(() => {
                // On recharge la liste pour voir la couleur changer
                fetchOrders();
                alert("Statut mis à jour !");
            })
            .catch(() => alert("Erreur lors de la mise à jour"));
    };

    // Fonction utilitaire pour la couleur des badges
    const getStatusBadge = (status) => {
        const colors = {
            pending: "bg-yellow-100 text-yellow-800",
            processing: "bg-blue-100 text-blue-800",
            shipped: "bg-purple-100 text-purple-800",
            delivered: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800"
        };
        return `px-2 py-1 rounded text-xs font-bold uppercase ${colors[status] || 'bg-gray-100'}`;
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">🚚 Suivi des Commandes</h1>
            
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-white text-sm uppercase">
                        <tr>
                            <th className="p-4">Commande</th>
                            <th className="p-4">Client</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Statut Actuel</th>
                            <th className="p-4">Changer Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-mono font-bold">#{order.id}</td>
                                <td className="p-4">
                                    <div className="font-bold">{order.user ? order.user.name : 'Inconnu'}</div>
                                    <div className="text-xs text-gray-500">{order.user ? order.user.email : ''}</div>
                                </td>
                                <td className="p-4 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="p-4 font-bold">{order.total_price} €</td>
                                <td className="p-4">
                                    <span className={getStatusBadge(order.status)}>{order.status}</span>
                                </td>
                                <td className="p-4">
                                    <select 
                                        value={order.status} 
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                        className="border p-1 rounded text-sm bg-white"
                                    >
                                        <option value="pending">En attente</option>
                                        <option value="processing">En cours</option>
                                        <option value="shipped">Expédié</option>
                                        <option value="delivered">Livré</option>
                                        <option value="cancelled">Annulé</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}