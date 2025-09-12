'use client';

import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';

export interface MenuItem {
	id: string;
	name: string;
	price: number;
	category: 'makanan' | 'minuman';
	image: string;
	description: string;
	available: boolean;
	bestSeller: boolean;
	stock: number;
	toppings?: Topping[];
}

export interface Topping {
	id: string;
	name: string;
	price: number;
	stock: number;
	quantity?: number;
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

const CartContext = createContext<{
	state: CartState;
	dispatch: React.Dispatch<CartAction>;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
	// Pastikan state.items selalu array
	const items = Array.isArray(state?.items) ? state.items : [];

	switch (action.type) {
		case 'ADD_ITEM': {
			const { menuItem, selectedToppings, quantity = 1 } = action.payload;
			const toppingsPrice = selectedToppings.reduce((sum, topping) => sum + topping.price, 0);
			const unitPrice = menuItem.price + toppingsPrice;

			// Fungsi membandingkan array toppings berdasarkan id tanpa memperhatikan urutan
			const isSameToppings = (a: Topping[], b: Topping[]) => {
				if (a.length !== b.length) return false;
				const aSet = new Set(a.map((t) => t.id));
				const bSet = new Set(b.map((t) => t.id));
				if (aSet.size !== bSet.size) return false;
				for (const id of aSet) {
					if (!bSet.has(id)) return false;
				}
				return true;
			};

			const existingItemIndex = items.findIndex((item) => item.menuItem.id === menuItem.id && isSameToppings(item.selectedToppings, selectedToppings));

			// Hitung sisa stock yang sudah ada di cart
			// Hitung total quantity yang sudah ada di cart untuk item yang sama
			const totalQtyInCart = items.filter((item) => item.menuItem.id === menuItem.id).reduce((sum, item) => sum + item.quantity, 0);

			// Hitung sisa stok yang tersedia
			const availableStock = menuItem.stock - totalQtyInCart;

			if (quantity > availableStock) {
				// Tidak bisa tambah melebihi stok
				return state;
			}

			if (existingItemIndex > -1) {
				const updatedItems = [...items];
				const existingItem = updatedItems[existingItemIndex];
				const newQuantity = existingItem.quantity + quantity;

				// Gabungkan quantity topping
				const mergedToppings = existingItem.selectedToppings.map((oldTopping) => {
					const newTopping = selectedToppings.find((t) => t.id === oldTopping.id);
					if (newTopping) {
						return {
							...oldTopping,
							quantity: (oldTopping.quantity ?? 1) + (newTopping.quantity ?? 1),
						};
					}
					return oldTopping;
				});
				// Tambahkan topping baru yang belum ada di item
				selectedToppings.forEach((newTopping) => {
					if (!mergedToppings.find((t) => t.id === newTopping.id)) {
						mergedToppings.push({ ...newTopping, quantity: newTopping.quantity ?? 1 });
					}
				});

				updatedItems[existingItemIndex] = {
					...existingItem,
					quantity: newQuantity,
					selectedToppings: mergedToppings,
					totalPrice: unitPrice * newQuantity,
				};

				return {
					items: updatedItems,
					total: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0),
				};
			}

			const newItem: CartItem = {
				id: `${menuItem.id}-${Date.now()}`,
				menuItem: { ...menuItem },
				quantity: quantity,
				selectedToppings,
				totalPrice: unitPrice * quantity,
			};

			const newItems = [...items, newItem];
			return {
				items: newItems,
				total: newItems.reduce((sum, item) => sum + item.totalPrice, 0),
			};
		}

		case 'REMOVE_ITEM': {
			const removedItem = items.find((item) => item.id === action.payload);
			const newItems = items.filter((item) => item.id !== action.payload);

			// Tidak perlu memodifikasi stock ketika menghapus item
			// Stock dikelola oleh menu-data, bukan oleh cart

			return {
				items: newItems,
				total: newItems.reduce((sum, item) => sum + item.totalPrice, 0),
			};
		}

		case 'UPDATE_QUANTITY': {
			const { id, quantity } = action.payload;
			if (quantity <= 0) {
				return cartReducer(state, { type: 'REMOVE_ITEM', payload: id });
			}

			const targetItem = items.find((item) => item.id === id);
			if (!targetItem) return state;

			// Hitung total quantity di cart untuk item yang sama (tidak termasuk item yang sedang diupdate)
			const otherItems = items.filter((item) => item.menuItem.id === targetItem.menuItem.id && item.id !== id);
			const otherQty = otherItems.reduce((sum, item) => sum + item.quantity, 0);

			// Cek stok yang tersedia (stok awal - quantity item lain)
			const availableStock = targetItem.menuItem.stock - otherQty;

			// Pastikan quantity baru tidak melebihi stok yang tersedia
			if (quantity > availableStock) {
				return state;
			}

			const updatedItems = items.map((item) => {
				if (item.id === id) {
					const unitPrice = item.menuItem.price + item.selectedToppings.reduce((sum, topping) => sum + topping.price, 0);
					return {
						...item,
						quantity,
						totalPrice: unitPrice * quantity,
					};
				}
				return item;
			});

			return {
				items: updatedItems,
				total: updatedItems.reduce((sum, item) => sum + item.totalPrice, 0),
			};
		}

		case 'EDIT_ITEM': {
			const { id, menuItem, selectedToppings, quantity } = action.payload;

			const updatedItems = items.map((item) => {
				if (item.id === id) {
					// Hitung harga unit baru
					const toppingsPrice = selectedToppings.reduce((sum, topping) => sum + topping.price * (topping.quantity ?? 1), 0);
					const unitPrice = menuItem.price + toppingsPrice / (quantity || 1); // rata-rata per unit

					return {
						...item,
						menuItem: { ...menuItem },
						quantity,
						selectedToppings,
						totalPrice: menuItem.price * quantity + toppingsPrice,
					};
				}
				return item;
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

export function CartProvider({ children }: { children: ReactNode }) {
	// Ambil initial state dari localStorage jika ada
	const getInitialState = (): CartState => {
		if (typeof window !== 'undefined') {
			const savedCart = localStorage.getItem('warung-cart');
			if (savedCart) {
				try {
					return JSON.parse(savedCart);
				} catch (error) {
					console.error('Error parsing cart from localStorage:', error);
				}
			}
		}
		return { items: [], total: 0 };
	};

	const [state, dispatch] = useReducer(cartReducer, undefined, getInitialState);

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
