import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from "../axios-client.js";

export default function Register() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState(null);
  const [payload, setPayload] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const onSubmit = (ev) => {
    ev.preventDefault();
    setErrors(null);

    // Envoi des données à l'API Laravel via axiosClient
    axiosClient.post('/register', payload)
      .then(({ data }) => {
        // 1. Inscription réussie : on stocke le token directement
        localStorage.setItem('ACCESS_TOKEN', data.token);
        
        // Optionnel : stocker le rôle ou le nom
        if(data.user) {
            localStorage.setItem('USER_ROLE', data.user.role || 'client');
        }

        alert("Compte créé avec succès ! Bienvenue.");
        
        // 2. Redirection vers l'accueil
        navigate('/');
      })
      .catch(err => {
        const response = err.response;
        // Gestion des erreurs de validation Laravel (ex: Email déjà pris)
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        } else {
          console.error(err);
          alert("Une erreur est survenue. Vérifiez votre connexion.");
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Créer un compte</h1>

        {/* Affichage des erreurs de validation */}
        {errors && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {Object.keys(errors).map(key => (
              <p key={key}>• {errors[key][0]}</p>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom complet</label>
            <input 
              type="text" 
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={payload.name}
              onChange={ev => setPayload({ ...payload, name: ev.target.value })}
              placeholder="Jean Dupont"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={payload.email}
              onChange={ev => setPayload({ ...payload, email: ev.target.value })}
              placeholder="jean@exemple.fr"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input 
              type="password" 
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={payload.password}
              onChange={ev => setPayload({ ...payload, password: ev.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <input 
              type="password" 
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={payload.password_confirmation}
              onChange={ev => setPayload({ ...payload, password_confirmation: ev.target.value })}
              required
            />
          </div>

          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition duration-200">
            S'inscrire
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Déjà un compte ? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}