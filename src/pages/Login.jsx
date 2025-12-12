import { useState } from 'react';
import axiosClient from "../axios-client.js";
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosClient.post('/login', creds)
      .then(res => {
        localStorage.setItem('ACCESS_TOKEN', res.data.token);
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.user?.role || 'user');
        
        // Redirection rapide
        if (res.data.user?.role === 'admin') navigate('/admin');
        else navigate('/');
      })
      .catch(() => setError("Identifiants incorrects"));
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded shadow-md border border-gray-200 w-full max-w-md">
        <h1 className="text-2xl font-bold text-[#1D428A] mb-6 text-center uppercase border-b pb-4">Identification</h1>
        
        {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Adresse Email</label>
                <input 
                    type="email" 
                    className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 outline-none"
                    value={creds.email}
                    onChange={e => setCreds({...creds, email: e.target.value})}
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Mot de passe</label>
                <input 
                    type="password" 
                    className="w-full border border-gray-300 p-2 rounded focus:border-blue-500 outline-none"
                    value={creds.password}
                    onChange={e => setCreds({...creds, password: e.target.value})}
                    required
                />
            </div>
            <button className="w-full bg-[#1D428A] hover:bg-[#15326d] text-white font-bold py-3 rounded transition uppercase">
                Se connecter
            </button>
        </form>

        <div className="mt-6 text-center text-sm border-t pt-4">
            Pas encore de compte ? <Link to="/register" className="text-blue-600 font-bold hover:underline">Créer un compte</Link>
        </div>
      </div>
    </div>
  );
}