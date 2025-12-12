export default function Footer() {
  return (
    <footer className="bg-[#1D428A] text-white pt-10 pb-6 text-sm mt-12">
      <div className="max-w-[1600px] mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div>
            <h3 className="font-bold text-lg mb-4 text-blue-200">A PROPOS</h3>
            <ul className="space-y-2 opacity-80">
                <li>Qui sommes-nous ?</li>
                <li>Nos magasins</li>
                <li>Carrières</li>
                <li>Presse</li>
            </ul>
        </div>

        <div>
            <h3 className="font-bold text-lg mb-4 text-blue-200">AIDE & SERVICES</h3>
            <ul className="space-y-2 opacity-80">
                <li>Contact</li>
                <li>SAV</li>
                <li>Garanties</li>
                <li>Modes de paiement</li>
            </ul>
        </div>

        <div>
            <h3 className="font-bold text-lg mb-4 text-blue-200">COMMUNAUTÉ</h3>
            <ul className="space-y-2 opacity-80">
                <li>Facebook</li>
                <li>Twitter / X</li>
                <li>Instagram</li>
                <li>YouTube</li>
            </ul>
        </div>

        <div>
            <h3 className="font-bold text-lg mb-4 text-blue-200">NEWSLETTER</h3>
            <p className="mb-4 opacity-80 text-xs">Recevez nos meilleures offres !</p>
            <div className="flex">
                <input type="email" placeholder="Votre email" className="px-3 py-2 text-gray-900 rounded-l w-full outline-none" />
                <button className="bg-blue-500 px-4 py-2 font-bold rounded-r hover:bg-blue-400">OK</button>
            </div>
        </div>

      </div>
      <div className="max-w-[1600px] mx-auto px-4 mt-10 pt-6 border-t border-blue-800 text-center text-xs opacity-60">
        © 2025 BTS High-Tech - Reproduction interdite. Site démo éducatif.
      </div>
    </footer>
  );
}