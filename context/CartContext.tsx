import { createContext, useContext, useState, useOptimistic, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, Product } from '../types';
import { cartAPI } from '../src/api';
import { useAuth } from './AuthContext';

interface CartContextType {
	cart: CartItem[];
	optimisticCart: CartItem[];
	addToCart: (product: Product) => Promise<void>;
	updateQuantity: (id: string, delta: number) => void;
	removeFromCart: (id: string) => void;
	checkout: () => Promise<{ message: string; orderSummary: any[]; total: number }>;
	cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
	const [cart, setCart] = useState<CartItem[]>([]);
	const { user, token } = useAuth();

	useEffect(() => {
		if (user && token) {
			cartAPI.getCart().then(setCart).catch(console.error);
		} else {
			setCart([]);
		}
	}, [user, token]);

	// useOptimistic permite actualizar la UI antes de que termine la operación asíncrona
	const [optimisticCart, addOptimisticItem] = useOptimistic(cart, (state: CartItem[], newProduct: Product) => {
		const existing = state.find((item) => item.id === newProduct.id);
		if (existing) {
			return state.map((item) => (item.id === newProduct.id ? { ...item, quantity: item.quantity + 1 } : item));
		}
		return [...state, { ...newProduct, quantity: 1 }];
	});

	const addToCart = async (product: Product) => {
		if (!token) throw new Error('Must be logged in to add to cart');

		// 1. Actualización optimista inmediata
		addOptimisticItem(product);

		try {
			// 2. Llamada a la API
			const updatedCart = await cartAPI.addToCart(product.id);

			// 3. Actualización real del estado con datos del servidor
			setCart(updatedCart);
		} catch (error) {
			console.error('Error adding to cart:', error);
			throw error;
		}
	};

	const updateQuantity = async (cartId: string, delta: number) => {
		try {
			const item = cart.find(item => item.cartId === cartId);
			if (!item) return;

			const newQuantity = Math.max(1, item.quantity + delta);
			const updatedCart = await cartAPI.updateQuantity(cartId, newQuantity);
			setCart(updatedCart);
		} catch (error) {
			console.error('Error updating quantity:', error);
		}
	};

	const removeFromCart = async (cartId: string) => {
		try {
			const updatedCart = await cartAPI.removeFromCart(cartId);
			setCart(updatedCart);
		} catch (error) {
			console.error('Error removing from cart:', error);
		}
	};

	const checkout = async () => {
		const result = await cartAPI.checkout();
		setCart([]); // Clear cart on success
		// Optionally, trigger a cart refresh or notify parent to refetch products
		return result;
	};

	const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

	// En React 19 ya no es necesario .Provider, se usa directamente el Context
	return (
		<CartContext
			value={{
				cart,
				optimisticCart,
				addToCart,
				updateQuantity,
				removeFromCart,
				checkout,
				cartCount,
			}}
		>
			{children}
		</CartContext>
	);
}

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
	return context;
};
