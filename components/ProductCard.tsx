import React, { useActionState } from 'react';
import { Product } from '../types';
import { Star, Plus, Check, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
	product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
	const { addToCart } = useCart();

	// useActionState maneja el estado de carga y el resultado de la "acción" automáticamente
	const [state, action, isPending] = useActionState(async () => {
		await addToCart(product);
		return { success: true };
	}, null);

	return (
		<div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
			<div className="relative aspect-square overflow-hidden bg-slate-200">
				<img
					src={product.image}
					alt={product.name}
					className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
				/>

				<form action={action}>
					<button
						type="submit"
						disabled={isPending}
						className={`absolute bottom-4 right-4 p-3 rounded-xl transform transition-all duration-300 shadow-lg ${
							isPending
								? 'bg-slate-400'
								: state?.success
								? 'bg-green-500'
								: 'bg-indigo-600 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
						} text-white hover:scale-105 active:scale-95`}
					>
						{isPending ? (
							<Loader2 className="h-5 w-5 animate-spin" />
						) : state?.success ? (
							<Check className="h-5 w-5" />
						) : (
							<Plus className="h-5 w-5" />
						)}
					</button>
				</form>

				<div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-semibold text-slate-700">
					{product.category}
				</div>
			</div>

			<div className="p-5">
				<div className="flex justify-between items-start mb-1">
					<h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
					<div className="flex items-center text-amber-500">
						<Star className="h-3 w-3 fill-current" />
						<span className="text-xs ml-1 font-medium">{product.rating}</span>
					</div>
				</div>
				<p className="text-slate-500 text-sm line-clamp-2 mb-4 h-10">{product.description}</p>
				<div className="flex items-center justify-between">
					<span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
					<span className="text-xs text-slate-400">{product.stock} en stock</span>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
