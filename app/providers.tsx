'use client';

import { useEffect, useState } from 'react';
import { CartProvider } from '@/contexts/cart-context';
import { FavoritesProvider } from '@/contexts/favorites-context';
import { ThemeProvider } from '@/components/theme-provider';
import { LoadingScreen } from '@/components/ui/loading-screen';

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
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			{isLoading ? (
				<LoadingScreen />
			) : (
				<FavoritesProvider>
					<CartProvider>{children}</CartProvider>
				</FavoritesProvider>
			)}
		</ThemeProvider>
	);
}
