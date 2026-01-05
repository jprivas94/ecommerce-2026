import { Star } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
	product: Product;
	onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
	return (
		<div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
			<div className="relative aspect-square overflow-hidden bg-slate-200">
				<img
					src={product.image}
					alt={product.name}
					className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
				/>
			</div>

			<div className="p-6">
				<div className="flex items-center justify-between mb-2">
					<span className="text-xs font-bold uppercase tracking-widest text-slate-500">{product.category}</span>
					<div className="flex items-center space-x-1">
						<Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
						<span className="text-xs font-bold text-slate-700">{product.rating}</span>
					</div>
				</div>

				<h3 className="font-bold text-slate-900 mb-2 line-clamp-2">{product.name}</h3>
				<p className="text-sm text-slate-600 mb-4 line-clamp-3">{product.description}</p>

				<div className="flex items-center justify-between">
					<span className="text-lg font-black text-slate-900">${product.price}</span>
					<button
						onClick={() => onAddToCart?.(product)}
						className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-100"
					>
						Agregar al carrito
					</button>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;