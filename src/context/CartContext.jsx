import { createContext, useState, useEffect, useCallback, useMemo } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. INITIALISATION : On regarde si un panier existe déjà dans la mémoire
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('bts_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // 2. SAUVEGARDE AUTOMATIQUE : À chaque fois que 'cart' change, on enregistre (avec debounce)
  useEffect(() => {
    try {
      localStorage.setItem('bts_cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du panier:', error);
    }
  }, [cart]);

  const addToCart = useCallback((product) => {
    setCart(prevCart => [...prevCart, product]);
    // On n'ouvre plus le tiroir automatiquement (meilleure UX)
  }, []);

  const removeFromCart = useCallback((indexToRemove) => {
    setCart(prevCart => prevCart.filter((_, index) => index !== indexToRemove));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    // On vide aussi la mémoire
    try {
      localStorage.removeItem('bts_cart');
    } catch (error) {
      console.error('Erreur lors de la suppression du panier:', error);
    }
  }, []);

  const value = useMemo(() => ({
    cart, 
    addToCart, 
    removeFromCart, 
    clearCart,
    isCartOpen, 
    setIsCartOpen 
  }), [cart, addToCart, removeFromCart, clearCart, isCartOpen]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};