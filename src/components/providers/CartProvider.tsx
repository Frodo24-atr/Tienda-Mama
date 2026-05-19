'use client';

import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react';
import { CartItem, CartState, Product } from '@/types';

type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      if (state.items.find((i) => i.product.id === action.product.id)) return state;
      const items = [...state.items, { product: action.product, quantity: 1 }];
      return { items, total: items.reduce((s, i) => s + i.product.price, 0) };
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter((i) => i.product.id !== action.productId);
      return { items, total: items.reduce((s, i) => s + i.product.price, 0) };
    }
    case 'CLEAR_CART': return { items: [], total: 0 };
    case 'LOAD_CART': {
      const items = action.items;
      return { items, total: items.reduce((s, i) => s + i.product.price * i.quantity, 0) };
    }
    default: return state;
  }
}

interface CartContextType {
  cart: CartState;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('vaccaro-cart');
    if (saved) {
      try { dispatch({ type: 'LOAD_CART', items: JSON.parse(saved) }); } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vaccaro-cart', JSON.stringify(cart.items));
  }, [cart.items]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart: (product) => dispatch({ type: 'ADD_ITEM', product }),
      removeFromCart: (id) => dispatch({ type: 'REMOVE_ITEM', productId: id }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
      isInCart: (id) => cart.items.some((i) => i.product.id === id),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
