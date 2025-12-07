import { useState } from 'react';
import axiosClient from "../axios-client.js";
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Login() {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    axiosClient.post('/login', payload)
      .then(res => {
        localStorage.setItem('token', res.data.token);
        let roleRecu = res.data.role;
        if (!roleRecu && res.data.user && res.data.user.role) roleRecu = res.data.user.role;
        localStorage.setItem('role', roleRecu || 'user');
        
        if (roleRecu === 'admin') navigate('/admin');
        else navigate('/');
        window.location.reload();
      })
      .catch(err => {
        setIsLoading(false);
        setError("Identifiants incorrects.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden font-sans text-white">
      
      {/* --- FOND ANIMÉ (Background) --- */}
      <div className="absolute inset-0 z-0">
        <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], x: [0, 100, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[120px]"
        />
        <motion.div 
            animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0], y: [0, -100, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]"
        />
      </div>

      {/* --- CARTE DE CONNEXION (Glassmorphism) --- */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 mb-4 shadow-lg shadow-indigo-500/30">
                <span className="text-3xl">🚀</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Bon retour.</h2>
            <p className="text-gray-400 mt-2 text-sm">Connectez-vous pour gérer vos commandes.</p>
        </div>

        {error && (
            <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
            </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Email</label>
                <div className="relative group">
                    <input 
                        type="email" required
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all group-hover:bg-gray-800/80"
                        placeholder="nom@exemple.com"
                        value={creds.email}
                        onChange={(e) => setCreds({...creds, email: e.target.value})}
                    />
                    <svg className="w-5 h-5 text-gray-500 absolute left-3 top-3.5 transition group-focus-within:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 ml-1 uppercase tracking-wider">Mot de passe</label>
                <div className="relative group">
                    <input 
                        type="password" required
                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all group-hover:bg-gray-800/80"
                        placeholder="••••••••"
                        value={creds.password}
                        onChange={(e) => setCreds({...creds, password: e.target.value})}
                    />
                    <svg className="w-5 h-5 text-gray-500 absolute left-3 top-3.5 transition group-focus-within:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
            </div>

            <button 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
        </form>

        <p className="mt-8 text-center text-gray-400 text-sm">
            Nouveau ici ?{' '}
            <Link to="/register" className="font-bold text-white hover:text-indigo-300 transition underline decoration-indigo-500 decoration-2 underline-offset-4">
                Créer un compte
            </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;