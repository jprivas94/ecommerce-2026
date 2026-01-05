import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
	id: string;
	email: string;
	name: string;
}

interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, name: string) => Promise<void>;
	logout: () => void;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const storedToken = localStorage.getItem('token');
		const storedUser = localStorage.getItem('user');
		if (storedToken && storedUser) {
			setToken(storedToken);
			setUser(JSON.parse(storedUser));
		}
		setLoading(false);
	}, []);

	const login = async (email: string, password: string) => {
		const response = await fetch('https://ecommerce-backend-j2zb.onrender.com/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Login failed');
		}

		const data = await response.json();
		setToken(data.token);
		setUser(data.user);
		localStorage.setItem('token', data.token);
		localStorage.setItem('user', JSON.stringify(data.user));
	};

	const register = async (email: string, password: string, name: string) => {
		const response = await fetch('https://ecommerce-backend-j2zb.onrender.com/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password, name }),
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Registration failed');
		}

		const data = await response.json();
		setToken(data.token);
		setUser(data.user);
		localStorage.setItem('token', data.token);
		localStorage.setItem('user', JSON.stringify(data.user));
	};

	const logout = () => {
		setToken(null);
		setUser(null);
		localStorage.removeItem('token');
		localStorage.removeItem('user');
	};

	return (
		<AuthContext.Provider value={{ user, token, login, register, logout, loading }}>{children}</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within AuthProvider');
	return context;
};
