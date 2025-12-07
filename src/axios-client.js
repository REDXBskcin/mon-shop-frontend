import axios from 'axios';

// URL de base dynamique :
// - En local, ça utilise ton fichier .env
// - Sur Vercel, ça utilise la configuration du site
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
    // On vérifie les deux noms possibles pour le token par sécurité
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

// Intercepteur de réponse : gère la déconnexion (Erreur 401)
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response && response.status === 401) {
      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;