import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useAuth } from '../context/AuthContext'; // On utilise le contexte

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { setToken, setUser } = useAuth(); // Import du contexte

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    axiosClient.post('/register', formData)
      .then(({ data }) => {
        setToken(data.token);
        setUser(data.user);
        navigate('/'); // Redirection accueil connecté
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          // Gestion simplifiée des erreurs
          setError(Object.values(response.data.errors).flat()[0]); 
        } else {
          setError("Une erreur est survenue.");
        }
      });
  };

  return (
    <div className="min-h-[600px] flex items-center justify-center p-4 bg-[#F2F4F8]">
      <div className="bg-white p-8 rounded shadow-md border border-gray-200 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-[#1D428A] mb-2 text-center uppercase">Créer un compte</h1>
        <p className="text-center text-gray-500 text-sm mb-6 pb-4 border-b">Rejoignez la communauté High-Tech</p>

        {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-sm font-medium">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Nom complet</label>
                <input 
                    type="text" 
                    className="w-full border border-gray-300 p-2.5 rounded focus:border-[#1D428A] outline-none"
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Adresse Email</label>
                <input 
                    type="email" 
                    className="w-full border border-gray-300 p-2.5 rounded focus:border-[#1D428A] outline-none"
                    placeholder="jean@exemple.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Mot de passe</label>
                    <input 
                        type="password" 
                        className="w-full border border-gray-300 p-2.5 rounded focus:border-[#1D428A] outline-none"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Confirmation</label>
                    <input 
                        type="password" 
                        className="w-full border border-gray-300 p-2.5 rounded focus:border-[#1D428A] outline-none"
                        value={formData.password_confirmation}
                        onChange={e => setFormData({...formData, password_confirmation: e.target.value})}
                        required
                    />
                </div>
            </div>

            <div className="pt-2">
                <button className="w-full bg-[#1D428A] hover:bg-[#15326d] text-white font-bold py-3 rounded transition uppercase shadow-sm">
                    Valider mon inscription
                </button>
            </div>
        </form>

        <div className="mt-6 text-center text-sm bg-gray-50 p-4 rounded border border-gray-100">
            Vous avez déjà un compte ? <Link to="/login" className="text-[#1D428A] font-bold hover:underline">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}