import React, { createContext, useContext, useState, useOptimistic, ReactNode } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
	cart: CartItem[];
	optimisticCart: CartItem[];
	addToCart: (product: Product) => Promise<void>;
	updateQuantity: (id: string, delta: number) => void;
	removeFromCart: (id: string) => void;
	cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
	const [cart, setCart] = useState<CartItem[]>([]);

	// useOptimistic permite actualizar la UI antes de que termine la operación asíncrona
	const [optimisticCart, addOptimisticItem] = useOptimistic(cart, (state: CartItem[], newProduct: Product) => {
		const existing = state.find((item) => item.id === newProduct.id);
		if (existing) {
			return state.map((item) => (item.id === newProduct.id ? { ...item, quantity: item.quantity + 1 } : item));
		}
		return [...state, { ...newProduct, quantity: 1 }];
	});

	const addToCart = async (product: Product) => {
		// 1. Actualización optimista inmediata
		addOptimisticItem(product);

		// 2. Simulamos un delay de red/servidor (Action)
		await new Promise((resolve) => setTimeout(resolve, 600));

		// 3. Actualización real del estado
		setCart((prev) => {
			const existing = prev.find((item) => item.id === product.id);
			if (existing) {
				return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
			}
			return [...prev, { ...product, quantity: 1 }];
		});
	};

	const updateQuantity = (id: string, delta: number) => {
		setCart((prev) =>
			prev.map((item) => {
				if (item.id === id) {
					const newQty = Math.max(1, item.quantity + delta);
					return { ...item, quantity: newQty };
				}
				return item;
			}),
		);
	};

	const removeFromCart = (id: string) => {
		setCart((prev) => prev.filter((item) => item.id !== id));
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
