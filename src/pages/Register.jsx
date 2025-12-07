import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    axios.post('http://127.0.0.1:8000/api/register', formData)
      .then(res => {
        alert("Compte créé !");
        navigate('/login');
      })
      .catch(err => {
        setIsLoading(false);
        setError("Erreur : Email déjà pris ou mot de passe trop court.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden font-sans text-white">
      
      {/* --- FOND ANIMÉ --- */}
      <div className="absolute inset-0 z-0">
        <motion.div 
            animate={{ scale: [1, 1.1, 1], x: [0, -50, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-[100px]"
        />
        <motion.div 
            animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px]"
        />
      </div>

      {/* --- CARTE INSCRIPTION --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Créer un compte</h2>
            <p className="text-gray-400 mt-2 text-sm">Rejoignez la communauté des devs.</p>
        </div>

        {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="group">
                <input 
                    type="text" required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="Nom complet"
                    onChange={e => setFormData({...formData, name: e.target.value})}
                />
            </div>

            <div className="group">
                <input 
                    type="email" required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="Adresse Email"
                    onChange={e => setFormData({...formData, email: e.target.value})}
                />
            </div>

            <div className="group">
                <input 
                    type="password" required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="Mot de passe (6+ caractères)"
                    onChange={e => setFormData({...formData, password: e.target.value})}
                />
            </div>

            <button 
                disabled={isLoading}
                className="w-full bg-white text-gray-900 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 mt-4"
            >
                {isLoading ? 'Création...' : 'S\'inscrire'}
            </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
            Déjà un compte ?{' '}
            <Link to="/login" className="font-bold text-white hover:text-indigo-300 transition underline decoration-indigo-500 decoration-2 underline-offset-4">
                Se connecter
            </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Register;