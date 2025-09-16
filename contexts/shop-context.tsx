'use client';

import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { getJakartaNow, isMonToSat, storeHours } from '@/lib/utils';

// Hardcode toggle: set to true to force-close the shop universally
const FORCE_CLOSED = true;

type OverrideMode = 'open' | 'closed' | null;

interface ShopState {
	isOpenBySchedule: boolean;
	override: OverrideMode;
	forceClosed: boolean;
	isOpenEffective: boolean;
	canOrder: boolean;
	noticeWhenClosed?: string;
	updatedAt: number;
}

type ShopAction = { type: 'TICK' } | { type: 'SET_OVERRIDE'; payload: OverrideMode } | { type: 'SET_FORCE_CLOSED'; payload: boolean } | { type: 'SET_NOTICE'; payload?: string } | { type: 'LOAD_SHOP'; payload: ShopState };

const initialState: ShopState = {
	isOpenBySchedule: false,
	override: null,
	forceClosed: false,
	isOpenEffective: false,
	canOrder: false,
	noticeWhenClosed: 'Warung sedang tutup. Silakan kembali pada jam operasional.',
	updatedAt: Date.now(),
};

function computeBySchedule(): boolean {
	const { weekday, hour } = getJakartaNow();
	const openToday = isMonToSat(weekday);
	const openByHour = hour >= storeHours.open && hour < storeHours.close;
	return openToday && openByHour;
}

function deriveEffective(state: Pick<ShopState, 'override' | 'forceClosed'>): { isOpenEffective: boolean; canOrder: boolean } {
	if (FORCE_CLOSED || state.forceClosed) return { isOpenEffective: false, canOrder: false };
	if (state.override === 'open') return { isOpenEffective: true, canOrder: true };
	if (state.override === 'closed') return { isOpenEffective: false, canOrder: false };
	const bySchedule = computeBySchedule();
	return { isOpenEffective: bySchedule, canOrder: bySchedule };
}

function shopReducer(state: ShopState, action: ShopAction): ShopState {
	switch (action.type) {
		case 'TICK': {
			const isOpenBySchedule = computeBySchedule();
			const derived = deriveEffective({ override: state.override, forceClosed: state.forceClosed });
			return {
				...state,
				isOpenBySchedule,
				isOpenEffective: derived.isOpenEffective,
				canOrder: derived.canOrder,
				updatedAt: Date.now(),
			};
		}
		case 'SET_OVERRIDE': {
			const override = action.payload;
			const derived = deriveEffective({ override, forceClosed: state.forceClosed });
			return {
				...state,
				override,
				isOpenEffective: derived.isOpenEffective,
				canOrder: derived.canOrder,
				updatedAt: Date.now(),
			};
		}
		case 'SET_FORCE_CLOSED': {
			const forceClosed = action.payload;
			const derived = deriveEffective({ override: state.override, forceClosed });
			return {
				...state,
				forceClosed,
				isOpenEffective: derived.isOpenEffective,
				canOrder: derived.canOrder,
				updatedAt: Date.now(),
			};
		}
		case 'SET_NOTICE': {
			return { ...state, noticeWhenClosed: action.payload, updatedAt: Date.now() };
		}
		case 'LOAD_SHOP': {
			const loaded = action.payload;
			const derived = deriveEffective({ override: loaded.override, forceClosed: loaded.forceClosed });
			return {
				...loaded,
				isOpenEffective: derived.isOpenEffective,
				canOrder: derived.canOrder,
			};
		}
		default:
			return state;
	}
}

const ShopContext = createContext<{ state: ShopState; dispatch: React.Dispatch<ShopAction> } | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
	const getInitial = (): ShopState => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('warung-shop');
			if (saved) {
				try {
					const parsed = JSON.parse(saved) as Partial<ShopState>;
					if (parsed && typeof parsed === 'object') {
						const normalized: ShopState = {
							isOpenBySchedule: typeof parsed.isOpenBySchedule === 'boolean' ? parsed.isOpenBySchedule : initialState.isOpenBySchedule,
							override: (parsed.override ?? initialState.override) as OverrideMode,
							// Always obey the hardcoded flag
							forceClosed: FORCE_CLOSED,
							isOpenEffective: typeof parsed.isOpenEffective === 'boolean' ? parsed.isOpenEffective : initialState.isOpenEffective,
							canOrder: typeof parsed.canOrder === 'boolean' ? parsed.canOrder : initialState.canOrder,
							noticeWhenClosed: parsed.noticeWhenClosed ?? initialState.noticeWhenClosed,
							updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now(),
						};
						return shopReducer(normalized, { type: 'TICK' });
					}
				} catch (e) {
					console.error('Error parsing shop from localStorage:', e);
				}
			}
		}
		const isOpenBySchedule = computeBySchedule();
		const derived = deriveEffective({ override: null, forceClosed: false });
		return {
			...initialState,
			forceClosed: FORCE_CLOSED,
			isOpenBySchedule,
			isOpenEffective: derived.isOpenEffective,
			canOrder: derived.canOrder,
			updatedAt: Date.now(),
		};
	};

	const [state, dispatch] = useReducer(shopReducer, undefined as unknown as ShopState, getInitial);

	useEffect(() => {
		localStorage.setItem('warung-shop', JSON.stringify(state));
	}, [state]);

	useEffect(() => {
		const compute = () => dispatch({ type: 'TICK' });
		compute();
		const now = new Date();
		const msToNextMinute = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds());
		let intervalId: number | null = null;
		const timeoutId = window.setTimeout(() => {
			compute();
			intervalId = window.setInterval(compute, 60_000);
		}, msToNextMinute);

		return () => {
			window.clearTimeout(timeoutId);
			if (intervalId) window.clearInterval(intervalId);
		};
	}, []);

	return <ShopContext.Provider value={{ state, dispatch }}>{children}</ShopContext.Provider>;
}

export function useShop() {
	const ctx = useContext(ShopContext);
	if (!ctx) throw new Error('useShop must be used within a ShopProvider');
	return ctx;
}

export const setShopOverride = (dispatch: React.Dispatch<ShopAction>, mode: OverrideMode) => dispatch({ type: 'SET_OVERRIDE', payload: mode });

export const setShopNotice = (dispatch: React.Dispatch<ShopAction>, msg?: string) => dispatch({ type: 'SET_NOTICE', payload: msg });

export const setShopForceClosed = (dispatch: React.Dispatch<ShopAction>, force: boolean) => dispatch({ type: 'SET_FORCE_CLOSED', payload: force });
