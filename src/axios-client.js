import axios from 'axios';

// --- MODIFICATION MAJEURE ICI ---
// Au lieu de l'adresse IP fixe, on utilise la variable d'environnement.
// En local, ça lira ton fichier .env.
// Sur Vercel, ça lira la configuration que tu as faite sur le site.
const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur de requête : ajoute le token
axiosClient.interceptors.request.use(
  (config) => {
    // Vérifie bien si tu as appelé ta clé 'token' ou 'ACCESS_TOKEN' dans ton Login.jsx
    // Par sécurité, je mets 'ACCESS_TOKEN' car c'est le standard qu'on utilise souvent,
    // mais si tu as utilisé 'token' partout, remets 'token'.
    const token = localStorage.getItem('ACCESS_TOKEN') || localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse : gère les erreurs
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Si erreur 401 (Non autorisé/Token expiré)
    if (response && response.status === 401) {
      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      // Redirection vers le login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;