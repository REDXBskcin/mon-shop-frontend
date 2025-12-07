import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from "../axios-client.js";

function Login() {
  // Ici la variable s'appelle "creds"
  const [creds, setCreds] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // CORRECTION ICI : On utilise bien "creds" et pas "payload"
    axiosClient.post('/login', creds)
      .then(({data}) => {
        localStorage.setItem('ACCESS_TOKEN', data.token);
        localStorage.setItem('USER_ROLE', data.user.role);
        
        alert(`Bon retour, ${data.user.name} !`);
        
        if (data.user.role === 'admin') {
            navigate('/admin/products');
        } else {
            navigate('/');
        }
      })
      .catch(err => {
        console.error(err);
        const response = err.response;
        if (response && response.status === 422) {
            alert("Email ou mot de passe incorrect.");
        } else {
            alert("Une erreur est survenue.");
        }
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
              // On utilise bien creds.email
              value={creds.email}
              onChange={(e) => setCreds({...creds, email: e.target.value})}
              placeholder="admin@btsshop.fr"
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Mot de passe</label>
            <input 
              type="password" 
              className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
              // On utilise bien creds.password
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