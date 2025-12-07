import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const navigate = useNavigate(); // Pour changer de page automatiquement

  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios.post('http://127.0.0.1:8000/api/register', creds)
      .then(res => {
        // 1. On stocke le Token dans le navigateur (localStorage)
        localStorage.setItem('token', res.data.token);
        
        // 2. On redirige vers l'admin
        alert("Connexion réussie ! Bienvenue Chef.");
        navigate('/admin');
      })
      .catch(err => {
        console.error(err);
        alert("Email ou mot de passe incorrect.");
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">🔐 Connexion</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              value={creds.email}
              onChange={(e) => setCreds({...creds, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Mot de passe</label>
            <input 
              type="password" 
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              value={creds.password}
              onChange={(e) => setCreds({...creds, password: e.target.value})}
            />
          </div>

          <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition font-bold">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;