// Script pour ajouter 25 produits informatiques avec des images
// Usage: node add-products.js

const axios = require('axios');

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Produits informatiques avec images et descriptions
const products = [
  {
    name: 'Clavier Mécanique RGB Corsair K95',
    description: 'Clavier mécanique gaming premium avec switches Cherry MX, rétroéclairage RGB personnalisable, 6 touches macro programmables et repose-poignets ergonomique. Parfait pour les gamers et développeurs exigeants.',
    price: 199.99,
    stock: 15,
    image_url: 'https://picsum.photos/800/600?random=1'
  },
  {
    name: 'Souris Gaming Logitech G Pro X',
    description: 'Souris gaming professionnelle ultra-légère (63g), capteur HERO 25K, design ambidextre, 5 boutons programmables. Idéale pour le FPS et les compétitions e-sport.',
    price: 129.99,
    stock: 20,
    image_url: 'https://picsum.photos/800/600?random=2'
  },
  {
    name: 'Écran Gaming 27" 4K ASUS ROG',
    description: 'Moniteur 4K UHD 27 pouces, 144Hz, HDR10, FreeSync Premium, temps de réponse 1ms. Parfait pour le gaming compétitif et le montage vidéo professionnel.',
    price: 549.99,
    stock: 12,
    image_url: 'https://picsum.photos/800/600?random=3'
  },
  {
    name: 'Casque Audio SteelSeries Arctis Pro',
    description: 'Casque gaming haute fidélité avec son surround 7.1, micro rétractable, autonomie 20h, design confortable pour les longues sessions. Compatible PC, PS5, Xbox.',
    price: 179.99,
    stock: 18,
    image_url: 'https://picsum.photos/800/600?random=4'
  },
  {
    name: 'SSD NVMe Samsung 980 PRO 1TB',
    description: 'SSD M.2 PCIe 4.0, vitesse de lecture 7000 MB/s, écriture 5000 MB/s, technologie V-NAND 3-bit. Idéal pour accélérer votre système et vos jeux.',
    price: 149.99,
    stock: 30,
    image_url: 'https://picsum.photos/800/600?random=5'
  },
  {
    name: 'Carte Graphique NVIDIA RTX 4070',
    description: 'GPU gaming dernière génération, 12GB GDDR6X, ray tracing, DLSS 3.0, architecture Ada Lovelace. Performance exceptionnelle en 1440p et 4K.',
    price: 699.99,
    stock: 8,
    image_url: 'https://picsum.photos/800/600?random=6'
  },
  {
    name: 'Processeur AMD Ryzen 9 7900X',
    description: 'CPU 12 cœurs 24 threads, fréquence boost 5.6 GHz, socket AM5, architecture Zen 4. Parfait pour le gaming, streaming et création de contenu.',
    price: 549.99,
    stock: 10,
    image_url: 'https://picsum.photos/800/600?random=7'
  },
  {
    name: 'Carte Mère ASUS ROG Strix X670E',
    description: 'Carte mère AM5, support DDR5, PCIe 5.0, WiFi 6E, audio SupremeFX, refroidissement VRM avancé. Optimisée pour les processeurs Ryzen 7000.',
    price: 449.99,
    stock: 7,
    image_url: 'https://picsum.photos/800/600?random=8'
  },
  {
    name: 'RAM Corsair Vengeance DDR5 32GB',
    description: 'Kit mémoire 32GB (2x16GB) DDR5-5600, profil XMP 3.0, refroidisseur aluminium, design RGB. Compatible Intel et AMD dernière génération.',
    price: 199.99,
    stock: 25,
    image_url: 'https://picsum.photos/800/600?random=9'
  },
  {
    name: 'Alimentation Corsair RM850x 850W',
    description: 'Alimentation modulaire 80+ Gold, 850W, ventilateur silencieux, câbles plats, garantie 10 ans. Parfaite pour les configurations gaming haut de gamme.',
    price: 149.99,
    stock: 15,
    image_url: 'https://picsum.photos/800/600?random=10'
  },
  {
    name: 'Boîtier PC NZXT H7 Flow',
    description: 'Boîtier ATX moyen tour, ventilation optimisée, panneau latéral vitré, gestion des câbles, support GPU jusqu\'à 400mm. Design épuré et moderne.',
    price: 129.99,
    stock: 20,
    image_url: 'https://picsum.photos/800/600?random=11'
  },
  {
    name: 'Refroidissement CPU Noctua NH-D15',
    description: 'Ventirad double tour, 2 ventilateurs NF-A15, compatibilité universelle, silence optimal. Référence pour le refroidissement air haute performance.',
    price: 99.99,
    stock: 22,
    image_url: 'https://picsum.photos/800/600?random=12'
  },
  {
    name: 'Webcam Logitech C920 HD Pro',
    description: 'Webcam Full HD 1080p, autofocus, micro stéréo intégré, compatibilité Zoom/Teams. Idéale pour télétravail et streaming.',
    price: 79.99,
    stock: 35,
    image_url: 'https://picsum.photos/800/600?random=13'
  },
  {
    name: 'Microphone Blue Yeti USB',
    description: 'Microphone USB professionnel, 4 modes de captation, contrôle du gain, sortie casque, design premium. Standard pour le streaming et podcasting.',
    price: 129.99,
    stock: 16,
    image_url: 'https://picsum.photos/800/600?random=14'
  },
  {
    name: 'Tablette Graphique Wacom Intuos Pro',
    description: 'Tablette graphique 13 pouces, 8192 niveaux de pression, surface texturée, stylet Pro Pen 2. Référence pour les artistes numériques.',
    price: 399.99,
    stock: 9,
    image_url: 'https://picsum.photos/800/600?random=15'
  },
  {
    name: 'Disque Dur Externe Seagate 4TB',
    description: 'HDD externe USB 3.0, 4TB, design compact, sauvegarde automatique, compatible Mac/PC. Parfait pour stocker vos fichiers et sauvegardes.',
    price: 99.99,
    stock: 28,
    image_url: 'https://picsum.photos/800/600?random=16'
  },
  {
    name: 'Hub USB-C Anker 7-en-1',
    description: 'Hub USB-C avec ports HDMI 4K, USB 3.0, SD/TF, PD 100W, Ethernet. Compatible MacBook, Surface, Chromebook. Design compact et portable.',
    price: 49.99,
    stock: 40,
    image_url: 'https://picsum.photos/800/600?random=17'
  },
  {
    name: 'Clé USB 3.2 SanDisk 256GB',
    description: 'Clé USB haute vitesse, 256GB, vitesse de lecture 150 MB/s, design métallique robuste, garantie 5 ans. Stockage portable fiable.',
    price: 29.99,
    stock: 50,
    image_url: 'https://picsum.photos/800/600?random=18'
  },
  {
    name: 'Routeur WiFi 6 ASUS AX6000',
    description: 'Routeur gaming WiFi 6, tri-bande, portail gaming, AiMesh compatible, VPN Fusion. Couverture jusqu\'à 500m², idéal pour gaming et streaming.',
    price: 299.99,
    stock: 11,
    image_url: 'https://picsum.photos/800/600?random=19'
  },
  {
    name: 'Switch Réseau Netgear GS308',
    description: 'Switch Gigabit 8 ports, plug & play, design compact, économie d\'énergie. Parfait pour étendre votre réseau domestique ou bureau.',
    price: 24.99,
    stock: 45,
    image_url: 'https://picsum.photos/800/600?random=20'
  },
  {
    name: 'Câble HDMI 2.1 Ultra HD 8K',
    description: 'Câble HDMI 2.1 certifié, support 8K@60Hz, 4K@120Hz, eARC, HDR, longueur 2m. Compatible PS5, Xbox Series X, téléviseurs 8K.',
    price: 19.99,
    stock: 60,
    image_url: 'https://picsum.photos/800/600?random=21'
  },
  {
    name: 'Support Moniteur Ergotron LX',
    description: 'Bras articulé pour écran, support jusqu\'à 11kg, ajustement hauteur/pivot, gestion des câbles. Ergonomie optimale pour votre poste de travail.',
    price: 149.99,
    stock: 14,
    image_url: 'https://picsum.photos/800/600?random=22'
  },
  {
    name: 'Tapis de Souris Gaming XXL',
    description: 'Tapis de souris gaming 900x400mm, surface lisse optimisée, bordure surfilée, design RGB. Compatible toutes les souris optiques et laser.',
    price: 24.99,
    stock: 38,
    image_url: 'https://picsum.photos/800/600?random=23'
  },
  {
    name: 'Enceintes Logitech Z623 2.1',
    description: 'Système audio 2.1, 200W RMS, subwoofer 7 pouces, contrôle du volume sur satellite, entrées multiples. Son puissant pour gaming et musique.',
    price: 119.99,
    stock: 17,
    image_url: 'https://picsum.photos/800/600?random=24'
  },
  {
    name: 'Câble USB-C Anker PowerLine',
    description: 'Câble USB-C vers USB-C, 2m, charge rapide 100W, transfert données 480 Mbps, renforcé nylon, garantie 18 mois. Compatible tous appareils USB-C.',
    price: 14.99,
    stock: 55,
    image_url: 'https://picsum.photos/800/600?random=25'
  },
  {
    name: 'Station d\'Accueil USB-C Dell',
    description: 'Dock USB-C universel, 2x HDMI, 3x USB 3.0, Ethernet, audio, charge 90W. Transforme votre laptop en station de travail complète.',
    price: 179.99,
    stock: 13,
    image_url: 'https://picsum.photos/800/600?random=26'
  }
];

// Fonction pour ajouter un produit
async function addProduct(product, token) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/products`,
      product,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    console.log(`✓ ${product.name} ajouté avec succès`);
    return response.data;
  } catch (error) {
    console.error(`✗ Erreur pour ${product.name}:`, error.response?.data || error.message);
    throw error;
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Début de l\'ajout des produits...\n');
  
  // Demander le token d'authentification
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const token = await new Promise((resolve) => {
    readline.question('Entrez votre token d\'authentification admin (ou appuyez sur Entrée pour continuer sans token): ', (answer) => {
      readline.close();
      resolve(answer.trim() || null);
    });
  });

  let successCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      await addProduct(product, token);
      successCount++;
      // Petit délai pour éviter de surcharger l'API
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      errorCount++;
    }
  }

  console.log(`\n✅ Terminé ! ${successCount} produits ajoutés, ${errorCount} erreurs.`);
}

// Exécuter le script
main().catch(console.error);

