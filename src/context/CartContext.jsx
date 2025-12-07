import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. INITIALISATION : On regarde si un panier existe déjà dans la mémoire
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('bts_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // 2. SAUVEGARDE AUTOMATIQUE : À chaque fois que 'cart' change, on enregistre
  useEffect(() => {
    localStorage.setItem('bts_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    // On n'ouvre plus le tiroir automatiquement (meilleure UX)
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  const clearCart = () => {
    setCart([]);
    // On vide aussi la mémoire
    localStorage.removeItem('bts_cart');
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart,
      isCartOpen, 
      setIsCartOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};