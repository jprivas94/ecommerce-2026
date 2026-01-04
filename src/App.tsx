import React, { useState, useMemo, Suspense } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
// import AssistantChat from './components/AssistantChat';
import { PRODUCTS, CATEGORIES } from '../constants';
import { type Category } from '../types';
import { Filter, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const App: React.FC = () => {
	const { cartCount, optimisticCart, updateQuantity, removeFromCart } = useCart();
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [activeCategory, setActiveCategory] = useState<Category>('All');
	const [searchTerm, setSearchTerm] = useState('');

	const filteredProducts = useMemo(() => {
		return PRODUCTS.filter((product) => {
			const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
			const matchesSearch =
				product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				product.description.toLowerCase().includes(searchTerm.toLowerCase());
			return matchesCategory && matchesSearch;
		});
	}, [activeCategory, searchTerm]);

	return (
		<div className="min-h-screen flex flex-col bg-slate-50 w-full overflow-x-hidden">
			{/* Navbar ocupa el 100% de ancho con contenido centrado */}
			<Navbar cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} onSearch={setSearchTerm} />

			{/* Contenedor principal alineado con el Navbar */}
			<main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
				{/* Hero Section - Rediseñada para ser más cohesiva */}
				<section className="relative rounded-[2rem] overflow-hidden mb-12 bg-slate-900 min-h-[400px] flex items-center shadow-2xl group">
					<img
						src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600"
						alt="Hero"
						className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-1000 group-hover:scale-105"
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />

					<div className="relative z-10 px-8 sm:px-16 text-white max-w-3xl">
						<span className="inline-block bg-indigo-600 text-[10px] font-black tracking-[0.2em] px-3 py-1 rounded-md mb-6 uppercase">
							Tendencias 2024
						</span>
						<h1 className="text-5xl sm:text-7xl font-black mb-6 tracking-tighter leading-[0.9]">
							Estilo que <br />
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
								te define.
							</span>
						</h1>
						<p className="text-lg sm:text-xl text-slate-200 mb-10 max-w-md font-medium leading-relaxed">
							Explora una selección única de tecnología y moda diseñada para el futuro.
						</p>
						<div className="flex flex-wrap gap-4">
							<button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-xl hover:-translate-y-1 active:translate-y-0">
								Ver Colección
							</button>
							<button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all">
								Novedades
							</button>
						</div>
					</div>
				</section>

				{/* Sección de Filtros y Resultados */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-6 md:space-y-0 border-b border-slate-200 pb-8">
					<div className="flex items-center space-x-2 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto no-scrollbar">
						<div className="p-2 bg-white rounded-lg border border-slate-200 mr-2">
							<Filter className="h-5 w-5 text-slate-400" />
						</div>
						{CATEGORIES.map((cat) => (
							<button
								key={cat}
								onClick={() => setActiveCategory(cat as Category)}
								className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
									activeCategory === cat
										? 'bg-slate-900 text-white shadow-xl scale-105'
										: 'bg-white text-slate-500 hover:text-indigo-600 border border-slate-200'
								}`}
							>
								{cat}
							</button>
						))}
					</div>
					<div className="flex items-center space-x-4 w-full md:w-auto">
						<div className="text-slate-400 text-xs font-bold uppercase tracking-widest bg-white border border-slate-200 px-4 py-2 rounded-lg">
							{filteredProducts.length} Artículos
						</div>
					</div>
				</div>

				{/* Grid de Productos - Alineación centrada automática */}
				<Suspense
					fallback={
						<div className="h-64 flex items-center justify-center">
							<Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
						</div>
					}
				>
					{filteredProducts.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
							{filteredProducts.map((product) => (
								<ProductCard key={product.id} product={product} />
							))}
						</div>
					) : (
						<div className="py-24 flex flex-col items-center justify-center text-center">
							<div className="p-8 bg-white border border-slate-200 rounded-[2.5rem] mb-6 shadow-sm">
								<Filter className="h-16 w-16 text-slate-200" />
							</div>
							<h3 className="text-2xl font-bold text-slate-800 mb-2">Sin coincidencias</h3>
							<p className="text-slate-500 mb-6">Prueba ajustando tus filtros o términos de búsqueda.</p>
							<button
								onClick={() => {
									setActiveCategory('All');
									setSearchTerm('');
								}}
								className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
							>
								Restablecer todo
							</button>
						</div>
					)}
				</Suspense>
			</main>

			{/* Footer ocupa el 100% con contenido alineado */}
			<footer className="bg-slate-900 text-slate-400 pt-20 pb-10 w-full">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
					<div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
						<div className="md:col-span-5">
							<span className="text-3xl font-black text-white tracking-tighter mb-6 block">
								ECOMMERCE<span className="text-indigo-500">.</span>
							</span>
							<p className="text-slate-400 leading-relaxed text-lg max-w-sm mb-8">
								Llevando la experiencia de compra al siguiente nivel con tecnología de vanguardia y diseño artesanal.
							</p>
							<div className="flex space-x-4">
								<div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-600 transition-all cursor-pointer group">
									<span className="text-white font-bold group-hover:scale-110 transition-transform">IG</span>
								</div>
								<div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-600 transition-all cursor-pointer group">
									<span className="text-white font-bold group-hover:scale-110 transition-transform">TW</span>
								</div>
							</div>
						</div>

						<div className="md:col-span-2">
							<h4 className="font-black text-white mb-8 uppercase tracking-widest text-[10px]">Tienda</h4>
							<ul className="space-y-4 text-sm font-medium">
								{CATEGORIES.slice(1).map((cat) => (
									<li key={cat} className="hover:text-white cursor-pointer transition-colors inline-block w-full">
										{cat}
									</li>
								))}
							</ul>
						</div>

						<div className="md:col-span-2">
							<h4 className="font-black text-white mb-8 uppercase tracking-widest text-[10px]">Ayuda</h4>
							<ul className="space-y-4 text-sm font-medium">
								<li className="hover:text-white cursor-pointer transition-colors">Envíos</li>
								<li className="hover:text-white cursor-pointer transition-colors">Devoluciones</li>
								<li className="hover:text-white cursor-pointer transition-colors">Privacidad</li>
							</ul>
						</div>

						<div className="md:col-span-3">
							<h4 className="font-black text-white mb-8 uppercase tracking-widest text-[10px]">Newsletter</h4>
							<div className="relative">
								<input
									type="email"
									placeholder="Tu email..."
									className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
								/>
								<button className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-4 rounded-lg text-xs font-bold">
									OK
								</button>
							</div>
						</div>
					</div>

					<div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
						<p className="text-[10px] font-bold uppercase tracking-[0.2em]">
							© 2024 ECOMMERCE STUDIOS. ALL RIGHTS RESERVED.
						</p>
						<div className="flex space-x-8 text-[10px] font-bold uppercase tracking-[0.2em]">
							<span className="hover:text-white cursor-pointer">Términos</span>
							<span className="hover:text-white cursor-pointer">Seguridad</span>
						</div>
					</div>
				</div>
			</footer>

			<CartDrawer
				isOpen={isCartOpen}
				onClose={() => setIsCartOpen(false)}
				items={optimisticCart}
				onUpdateQuantity={updateQuantity}
				onRemove={removeFromCart}
			/>

			{/* <AssistantChat cartItems={optimisticCart} /> */}
		</div>
	);
};

export default App;
