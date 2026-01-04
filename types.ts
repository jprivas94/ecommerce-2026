export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	category: string;
	image: string;
	rating: number;
	stock: number;
}

export interface CartItem extends Product {
	quantity: number;
}

export interface ChatMessage {
	role: 'user' | 'assistant';
	content: string;
}

export type Category = 'All' | 'Electronics' | 'Apparel' | 'Home' | 'Accessories';
