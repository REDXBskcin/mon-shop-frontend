// Configuration centralisée d'Axios pour communiquer avec l'API Laravel
// Ce fichier permet de :
// 1. Définir l'URL de base de l'API une seule fois
// 2. Ajouter automatiquement le token d'authentification à chaque requête
// 3. Gérer les erreurs de manière centralisée

import axios from 'axios';

// URL de base de l'API Laravel (à modifier selon ton environnement)
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// On crée une instance d'axios avec la configuration de base
const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur de requête : ajoute automatiquement le token si l'utilisateur est connecté
axiosClient.interceptors.request.use(
  (config) => {
    // On récupère le token depuis le localStorage
    const token = localStorage.getItem('token');
    
    // Si un token existe, on l'ajoute dans les headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse : gère les erreurs communes (401, 403, etc.)
axiosClient.interceptors.response.use(
  (response) => {
    // Si tout va bien, on retourne la réponse
    return response;
  },
  (error) => {
    // Si on reçoit une erreur 401 (non autorisé), l'utilisateur n'est plus connecté
    if (error.response?.status === 401) {
      // On supprime le token et on redirige vers la page de connexion
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    
    // On retourne l'erreur pour que le composant puisse la gérer
    return Promise.reject(error);
  }
);

export default axiosClient;

