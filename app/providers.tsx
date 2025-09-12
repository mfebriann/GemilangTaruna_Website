'use client';

import { useEffect, useState } from 'react';
import { CartProvider } from '@/contexts/cart-context';
import { FavoritesProvider } from '@/contexts/favorites-context';
import { ThemeProvider } from '@/components/theme-provider';
import { LoadingScreen } from '@/components/ui/loading-screen';
import WhatsAppButton from '@/components/ui/whatsapButton';

export function Providers({ children }: { children: React.ReactNode }) {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Simulate loading time and wait for initial hydration
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey="gemilang-taruna-theme">
			{isLoading ? (
				<LoadingScreen />
			) : (
				<FavoritesProvider>
					<CartProvider>{children}</CartProvider>
					<WhatsAppButton className="sm:hidden" />
				</FavoritesProvider>
			)}
		</ThemeProvider>
	);
}
