'use client';

import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';

/* ========= Types & Helpers ========= */

type InfiniteStockString = '-' | 'Banyak' | '∞';
type StockInput = number | InfiniteStockString;

const isInfiniteStock = (s: unknown): s is InfiniteStockString => (typeof s === 'string' && (s === '-' || s.toLowerCase() === 'banyak')) || s === '∞';

export const toNumericStock = (s: StockInput): number => (isInfiniteStock(s) ? Number.POSITIVE_INFINITY : Number(s));

export interface MenuItem {
	id: string;
	name: string;
	price: number;
	category: 'makanan' | 'minuman';
	image: string;
	description: string;
	available: boolean;
	bestSeller: boolean;
	stock: StockInput;
	toppings?: Topping[];
	minToppingsRequired?: number;
}

export interface Topping {
	id: string;
	name: string;
	price: number;
	stock: StockInput;
	quantity?: number;
	autoSelect?: boolean;
	main?: boolean;
}

export interface CartItem {
	id: string;
	menuItem: MenuItem;
	quantity: number;
	selectedToppings: Topping[];
	totalPrice: number;
	notes?: string;
}

interface CartState {
	items: CartItem[];
	total: number;
}

type CartAction =
	| { type: 'ADD_ITEM'; payload: { menuItem: MenuItem; selectedToppings: Topping[]; quantity?: number } }
	| { type: 'REMOVE_ITEM'; payload: string }
	| { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
	| { type: 'EDIT_ITEM'; payload: { id: string; menuItem: MenuItem; selectedToppings: Topping[]; quantity: number } }
	| { type: 'UPDATE_NOTES'; payload: { id: string; notes: string } }
	| { type: 'CLEAR_CART' }
	| { type: 'LOAD_CART'; payload: CartState };

// Normalisasi qty topping minimal 1
const withQty = (tops: Topping[]) => (tops ?? []).map((t) => ({ ...t, quantity: t.quantity ?? 1 }));

// Subtotal topping
const toppingsSubtotal = (tops: Topping[]): number => (tops ?? []).reduce((sum, t) => sum + (t.price || 0) * (t.quantity ?? 1), 0);

// Bandingkan daftar topping berdasar ID (tanpa urutan)
const isSameToppings = (a: Topping[], b: Topping[]) => {
	if (a.length !== b.length) return false;
	const aSet = new Set(a.map((t) => t.id));
	const bSet = new Set(b.map((t) => t.id));
	if (aSet.size !== bSet.size) return false;
	for (const id of aSet) if (!bSet.has(id)) return false;
	return true;
};

/* ========= Reducer ========= */

const CartContext = createContext<{ state: CartState; dispatch: React.Dispatch<CartAction> } | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
	// Pastikan state.items selalu array
	const items = Array.isArray(state?.items) ? state.items : [];

	switch (action.type) {
		case 'ADD_ITEM': {
			const { menuItem, selectedToppings, quantity = 1 } = action.payload;

			const topsA = withQty(selectedToppings);

			// Cek apakah kombinasi menu+toppings yang sama sudah ada
			const existingItemIndex = items.findIndex((item) => item.menuItem.id === menuItem.id && isSameToppings(item.selectedToppings, topsA));

			// Stok menu utama (konversi union -> number | Infinity)
			const baseStock = toNumericStock(menuItem.stock);

			// Total qty menu sama yang sudah ada di cart
			const totalQtyInCart = items.filter((item) => item.menuItem.id === menuItem.id).reduce((sum, item) => sum + item.quantity, 0);

			// Stok tersedia: finite -> kurangi cart; infinite -> Infinity
			const availableStock = Number.isFinite(baseStock) ? baseStock - totalQtyInCart : Number.POSITIVE_INFINITY;

			if (quantity > availableStock) {
				// Melebihi stok menu, abaikan (toast bisa ditangani di caller)
				return state;
			}

			// Jika item dgn kombinasi topping sama sudah ada -> gabungkan
			if (existingItemIndex > -1) {
				const updatedItems = [...items];
				const existingItem = updatedItems[existingItemIndex];

				// Gabung qty menu
				const newQuantity = existingItem.quantity + quantity;

				// Merge topping: jumlahkan quantity per ID
				const mergedMap = new Map<string, Topping>();
				existingItem.selectedToppings.forEach((t) => mergedMap.set(t.id, { ...t, quantity: t.quantity ?? 1 }));
				topsA.forEach((t) => {
					const prev = mergedMap.get(t.id);
					const q = (t.quantity ?? 1) + (prev?.quantity ?? 0);
					mergedMap.set(t.id, { ...t, quantity: q });
				});
				const mergedToppings = Array.from(mergedMap.values());

				const totalPrice = menuItem.price * newQuantity + toppingsSubtotal(mergedToppings);

				updatedItems[existingItemIndex] = {
					...existingItem,
					quantity: newQuantity,
					selectedToppings: mergedToppings,
					totalPrice,
				};

				return {
					items: updatedItems,
					total: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0),
				};
			}

			// Item baru
			const totalPrice = menuItem.price * quantity + toppingsSubtotal(topsA);

			const newItem: CartItem = {
				id: `${menuItem.id}-${Date.now()}`,
				menuItem: { ...menuItem },
				quantity,
				selectedToppings: topsA,
				totalPrice,
			};

			const newItems = [...items, newItem];
			return {
				items: newItems,
				total: newItems.reduce((sum, item) => sum + item.totalPrice, 0),
			};
		}

		case 'REMOVE_ITEM': {
			const newItems = items.filter((item) => item.id !== action.payload);
			return {
				items: newItems,
				total: newItems.reduce((sum, item) => sum + item.totalPrice, 0),
			};
		}

		case 'UPDATE_QUANTITY': {
			const { id, quantity } = action.payload;

			// Hapus item jika qty <= 0
			if (quantity <= 0) {
				return cartReducer(state, { type: 'REMOVE_ITEM', payload: id });
			}

			const targetItem = items.find((item) => item.id === id);
			if (!targetItem) return state;

			// Total qty item lain dengan menu yang sama (kecuali target item)
			const otherQty = items.filter((item) => item.menuItem.id === targetItem.menuItem.id && item.id !== id).reduce((sum, item) => sum + item.quantity, 0);

			// Stok menu utama (finite -> cek batas; infinite -> bebas)
			const baseStock = toNumericStock(targetItem.menuItem.stock);
			const availableStock = Number.isFinite(baseStock) ? baseStock - otherQty : Number.POSITIVE_INFINITY;

			if (quantity > availableStock) {
				// Melebihi stok menu, abaikan
				return state;
			}

			const updatedItems = items.map((item) => {
				if (item.id !== id) return item;

				const topsSub = toppingsSubtotal(item.selectedToppings);
				return {
					...item,
					quantity,
					totalPrice: item.menuItem.price * quantity + topsSub,
				};
			});

			return {
				items: updatedItems,
				total: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0),
			};
		}

		case 'EDIT_ITEM': {
			const { id, menuItem, selectedToppings, quantity } = action.payload;

			const topsB = withQty(selectedToppings);

			const updatedItems = items.map((item) => {
				if (item.id !== id) return item;

				const totalPrice = menuItem.price * quantity + toppingsSubtotal(topsB);
				return {
					...item,
					menuItem: { ...menuItem },
					quantity,
					selectedToppings: topsB,
					totalPrice,
				};
			});

			return {
				items: updatedItems,
				total: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0),
			};
		}

		case 'UPDATE_NOTES': {
			const updatedItems = items.map((item) => (item.id === action.payload.id ? { ...item, notes: action.payload.notes } : item));
			return {
				items: updatedItems,
				total: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0),
			};
		}

		case 'CLEAR_CART':
			return { items: [], total: 0 };

		case 'LOAD_CART':
			return action.payload;

		default:
			return state;
	}
}

/* ========= Provider & Hook ========= */

export function CartProvider({ children }: { children: ReactNode }) {
	// Ambil initial state dari localStorage jika ada
	const getInitialState = (): CartState => {
		if (typeof window !== 'undefined') {
			const savedCart = localStorage.getItem('warung-cart');
			if (savedCart) {
				try {
					const parsed = JSON.parse(savedCart) as CartState;
					// Proteksi minimal
					if (parsed && Array.isArray(parsed.items) && typeof parsed.total === 'number') {
						return parsed;
					}
				} catch (error) {
					console.error('Error parsing cart from localStorage:', error);
				}
			}
		}
		return { items: [], total: 0 };
	};

	const [state, dispatch] = useReducer(cartReducer, undefined as unknown as CartState, getInitialState);

	useEffect(() => {
		localStorage.setItem('warung-cart', JSON.stringify(state));
	}, [state]);

	return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error('useCart must be used within a CartProvider');
	}
	return context;
}
