import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Colonne 1 : Marque & Info */}
        <div className="col-span-1 md:col-span-1 space-y-4">
          <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
            <span>🚀</span> BTS Shop
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            La plateforme de référence pour les étudiants du BTS SIO SLAM & SISR. 
            Matériel validé par les experts.
          </p>
          <div className="flex gap-4">
            {/* Fausses icônes réseaux sociaux */}
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-indigo-600 transition cursor-pointer">X</div>
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition cursor-pointer">in</div>
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition cursor-pointer">Ig</div>
          </div>
        </div>

        {/* Colonne 2 : Liens Rapides */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Navigation</h3>
          <ul className="space-y-3 text-sm font-medium">
            <li><Link to="/" className="hover:text-indigo-400 transition flex items-center gap-2"><span>→</span> Accueil</Link></li>
            <li><Link to="/cart" className="hover:text-indigo-400 transition flex items-center gap-2"><span>→</span> Mon Panier</Link></li>
            <li><Link to="/login" className="hover:text-indigo-400 transition flex items-center gap-2"><span>→</span> Espace Client</Link></li>
          </ul>
        </div>

        {/* Colonne 3 : Informations */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Support</h3>
          <ul className="space-y-3 text-sm font-medium">
            <li><a href="#" className="hover:text-indigo-400 transition">FAQ</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition">Retours & Remboursements</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition">Mentions Légales</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition">Contact</a></li>
          </ul>
        </div>

        {/* Colonne 4 : Newsletter */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Newsletter</h3>
          <p className="text-xs text-gray-500 mb-4">Recevez nos promos exclusives en avant-première.</p>
          <div className="flex flex-col gap-3">
            <input type="email" placeholder="votre@email.com" className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" />
            <button className="bg-indigo-600 text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-900/20">
              S'abonner
            </button>
          </div>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
        <p>© 2025 BTS SIO Shop. Tous droits réservés.</p>
        <p>Développé avec ❤️ et du café.</p>
      </div>
    </footer>
  );
}

export default Footer;