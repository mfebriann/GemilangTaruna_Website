'use client';

import type React from 'react';
import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { MenuItem } from './cart-context';

interface FavoritesState {
	items: MenuItem[];
}

type FavoritesAction = { type: 'ADD_FAVORITE'; payload: MenuItem } | { type: 'REMOVE_FAVORITE'; payload: string } | { type: 'CLEAR_FAVORITES' } | { type: 'LOAD_FAVORITES'; payload: MenuItem[] };

const FavoritesContext = createContext<{
	state: FavoritesState;
	dispatch: React.Dispatch<FavoritesAction>;
	isFavorite: (id: string) => boolean;
	toggleFavorite: (item: MenuItem) => void;
} | null>(null);

function favoritesReducer(state: FavoritesState, action: FavoritesAction): FavoritesState {
	const items = Array.isArray(state?.items) ? state.items : [];
	switch (action.type) {
		case 'ADD_FAVORITE': {
			const exists = items.some((item: MenuItem) => item.id === action.payload.id);
			if (exists) return state;

			return {
				items: [...items, action.payload],
			};
		}

		case 'REMOVE_FAVORITE': {
			return {
				items: state.items.filter((item) => item.id !== action.payload),
			};
		}

		case 'CLEAR_FAVORITES':
			return { items: [] };

		case 'LOAD_FAVORITES':
			return { items: action.payload };

		default:
			return state;
	}
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
	// Get initial state from localStorage if exists
	const getInitialState = (): FavoritesState => {
		if (typeof window !== 'undefined') {
			const savedFavorites = localStorage.getItem('warung-favorites');
			if (savedFavorites && savedFavorites !== 'undefined') {
				try {
					return { items: JSON.parse(savedFavorites) };
				} catch (error) {
					console.error('Error parsing favorites from localStorage:', error);
				}
			}
		}
		return { items: [] };
	};

	const [state, dispatch] = useReducer(favoritesReducer, undefined, getInitialState);

	useEffect(() => {
		localStorage.setItem('warung-favorites', JSON.stringify(state.items));
	}, [state.items]);

	const isFavorite = (id: string) => {
		return Array.isArray(state?.items) && state.items.some((item: MenuItem) => item.id === id);
	};

	const toggleFavorite = (item: MenuItem) => {
		if (isFavorite(item.id)) {
			dispatch({ type: 'REMOVE_FAVORITE', payload: item.id });
		} else {
			dispatch({ type: 'ADD_FAVORITE', payload: item });
		}
	};

	return <FavoritesContext.Provider value={{ state, dispatch, isFavorite, toggleFavorite }}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
	const context = useContext(FavoritesContext);
	if (!context) {
		throw new Error('useFavorites must be used within a FavoritesProvider');
	}
	return context;
}
