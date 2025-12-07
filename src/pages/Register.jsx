import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosClient from '../axios-client';
import Toast from '../components/Toast';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    axiosClient.post('/register', formData)
      .then(res => {
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate('/login');
        }, 2000);
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
            animate={{ scale: [1, 1.08, 1], x: [0, -30, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] right-[20%] w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-cyan-600/15 rounded-full blur-[80px] sm:blur-[100px] will-change-transform"
        />
        <motion.div 
            animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[10%] left-[10%] w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] bg-pink-600/15 rounded-full blur-[90px] sm:blur-[120px] will-change-transform"
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
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                />
            </div>

            <div className="group">
                <input 
                    type="email" required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="Adresse Email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                />
            </div>

            <div className="group">
                <input 
                    type="password" required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    placeholder="Mot de passe (6+ caractères)"
                    value={formData.password}
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

      {/* Toast de succès */}
      <Toast 
        show={showToast} 
        message="Compte créé avec succès ! 🎉" 
        type="success"
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default Register;