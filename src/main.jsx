import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Import du provider
import { CartProvider } from './context/CartContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* On enveloppe l'application pour que le panier soit dispo partout */}
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>,
)