import React from 'react';
import { ShoppingCart, Search, Menu, User } from 'lucide-react';

interface NavbarProps {
	cartCount: number;
	onCartClick: () => void;
	onSearch: (term: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick, onSearch }) => {
	return (
		<nav className="sticky top-0 z-40 glass-effect border-b border-slate-200">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex items-center">
						<span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent cursor-pointer">
							ECOMMERCE
						</span>
					</div>

					{/* Search Bar - Hidden on Mobile */}
					<div className="hidden md:flex flex-1 max-w-md mx-8">
						<div className="relative w-full">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Search className="h-4 w-4 text-slate-400" />
							</div>
							<input
								type="text"
								className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full bg-slate-100/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm"
								placeholder="Search products..."
								onChange={(e) => onSearch(e.target.value)}
							/>
						</div>
					</div>

					{/* Right Side Icons */}
					<div className="flex items-center space-x-4">
						<button className="p-2 text-slate-500 hover:text-indigo-600 transition-colors">
							<User className="h-6 w-6" />
						</button>
						<button
							onClick={onCartClick}
							className="relative p-2 text-slate-500 hover:text-indigo-600 transition-colors"
						>
							<ShoppingCart className="h-6 w-6" />
							{cartCount > 0 && (
								<span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
									{cartCount}
								</span>
							)}
						</button>
						<button className="md:hidden p-2 text-slate-500 hover:text-indigo-600 transition-colors">
							<Menu className="h-6 w-6" />
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
