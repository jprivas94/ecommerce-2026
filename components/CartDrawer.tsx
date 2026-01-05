import React, { useState } from 'react';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import type { CartItem } from '../types';
import { cartAPI } from '../src/api';

interface CartDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	items: CartItem[];
	onUpdateQuantity: (id: string, delta: number) => void;
	onRemove: (id: string) => void;
	onCheckout?: () => Promise<{ message: string; orderSummary: any[]; total: number }>;
	onCheckoutSuccess?: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout, onCheckoutSuccess }) => {
	const [checkoutLoading, setCheckoutLoading] = useState(false);
	const [checkoutError, setCheckoutError] = useState('');
	const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

	const handleCheckout = async () => {
		setCheckoutLoading(true);
		setCheckoutError('');
		try {
			if (onCheckout) {
				await onCheckout();
			} else {
				await cartAPI.checkout();
			}
			onCheckoutSuccess?.();
		} catch (error: any) {
			setCheckoutError(error.message || 'Checkout failed');
		} finally {
			setCheckoutLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 overflow-hidden">
			<div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

			<div className="absolute inset-y-0 right-0 max-w-full flex">
				<div className="w-screen max-w-md">
					<div className="h-full flex flex-col bg-white shadow-2xl">
						{/* Header */}
						<div className="flex-1 flex flex-col overflow-y-auto">
							<div className="px-6 py-6 bg-slate-50 flex items-center justify-between border-b border-slate-200">
								<div className="flex items-center space-x-2">
									<ShoppingBag className="h-5 w-5 text-indigo-600" />
									<h2 className="text-lg font-bold text-slate-900">Shopping Cart</h2>
								</div>
								<button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
									<X className="h-6 w-6" />
								</button>
							</div>

							{/* Items List */}
							<div className="flex-1 px-6 py-4">
								{items.length === 0 ? (
									<div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
										<div className="p-6 bg-slate-100 rounded-full">
											<ShoppingBag className="h-12 w-12 text-slate-300" />
										</div>
										<p className="text-lg font-medium">Tu carrito esta vacio</p>
										<button onClick={onClose} className="text-indigo-600 font-semibold hover:text-indigo-700">
											Comenzar a comprar
										</button>
									</div>
								) : (
									<ul className="divide-y divide-slate-100">
										{items.map((item) => (
											<li key={item.id} className="py-6 flex">
												<div className="flex-shrink-0 w-24 h-24 border border-slate-200 rounded-lg overflow-hidden">
													<img src={item.image} alt={item.name} className="w-full h-full object-cover" />
												</div>
												<div className="ml-4 flex-1 flex flex-col">
													<div>
														<div className="flex justify-between text-base font-semibold text-slate-900">
															<h3>{item.name}</h3>
															<p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
														</div>
														<p className="mt-1 text-sm text-slate-500">{item.category}</p>
													</div>
													<div className="flex-1 flex items-end justify-between text-sm">
														<div className="flex items-center border border-slate-200 rounded-lg bg-slate-50">
															<button
																onClick={() => onUpdateQuantity(item.cartId!, -1)}
																className="p-1 hover:text-indigo-600 transition-colors"
															>
																<Minus className="h-4 w-4" />
															</button>
															<span className="px-3 font-medium">{item.quantity}</span>
															<button
																onClick={() => onUpdateQuantity(item.cartId!, 1)}
																className="p-1 hover:text-indigo-600 transition-colors"
															>
																<Plus className="h-4 w-4" />
															</button>
														</div>
														<button
															onClick={() => onRemove(item.cartId!)}
															className="font-medium text-red-500 hover:text-red-600"
														>
															Eliminar
														</button>
													</div>
												</div>
											</li>
										))}
									</ul>
								)}
							</div>
						</div>

						{/* Footer */}
						{items.length > 0 && (
							<div className="border-t border-slate-200 px-6 py-6 bg-slate-50">
								<div className="flex justify-between text-base font-medium text-slate-900 mb-4">
									<p>Subtotal</p>
									<p className="text-xl font-bold">${total.toFixed(2)}</p>
								</div>
								<p className="mt-0.5 text-sm text-slate-500 mb-6">
									Envio y taxes estan calculados al finalizar la compra.
								</p>
								<button
									onClick={handleCheckout}
									disabled={checkoutLoading}
									className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
								>
									{checkoutLoading ? 'Processing...' : 'Checkout'} <ArrowRight className="ml-2 h-5 w-5" />
								</button>
								{checkoutError && (
									<p className="mt-2 text-sm text-red-600 text-center">{checkoutError}</p>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartDrawer;
