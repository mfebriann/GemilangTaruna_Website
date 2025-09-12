'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, ShoppingCart, Utensils, Menu, Home, NotebookText, Info, Phone, SunMedium } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useFavorites } from '@/contexts/favorites-context';
import { aboutUs, cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import WhatsAppButton from './ui/whatsapButton';

const navigation = [
	{ name: 'Home', href: '/', icon: Home },
	{ name: 'Menu', href: '/menu', icon: NotebookText },
	{ name: 'About', href: '/about', icon: Info },
	{ name: 'Contact', href: '/contact', icon: Phone },
];

export function Header() {
	const pathname = usePathname();
	const { state } = useCart();
	const { state: favoritesState } = useFavorites();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen((prev) => !prev);
	};

	return (
		<>
			<header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/95">
				<div className="container mx-auto px-4">
					<div className="flex h-16 items-center justify-between">
						<div className="flex items-center space-x-3">
							{/* Mobile Menu Button */}
							<button onClick={toggleMobileMenu} className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground" aria-label="Open mobile menu">
								<Menu className="h-5 w-5" />
							</button>

							{/* Logo */}
							<Link href="/" className="flex items-center space-x-2">
								<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
									<Utensils className="h-5 w-5" />
								</div>
								<span className="text-xl font-bold text-primary hidden sm:inline">{aboutUs.name}</span>
							</Link>
						</div>

						{/* Navigation */}
						<nav className="hidden md:flex items-center space-x-6">
							{navigation.map((item) => {
								return (
									<Link key={item.name} href={item.href} className={cn('flex items-center text-sm font-medium transition-colors hover:text-primary', pathname === item.href ? 'text-primary' : 'text-foreground')}>
										{item.name}
									</Link>
								);
							})}
						</nav>

						{/* Right side actions */}
						<div className="flex items-center space-x-2">
							{/* Wishlist */}
							<Link href="/favorites">
								<button className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
									<Heart className="h-5 w-5 text-gray-700" />
									{isHydrated && favoritesState.items.length > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{favoritesState.items.length}</span>}
								</button>
							</Link>

							{/* Cart */}
							<Link href="/cart">
								<button className="relative p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
									<ShoppingCart className="h-5 w-5 text-gray-700" />
									{isHydrated && state.items.length > 0 && (
										<span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{state.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
									)}
								</button>
							</Link>

							{/* WhatsApp */}
							<WhatsAppButton className="hidden sm:flex" />
						</div>
					</div>
				</div>
			</header>

			{/* Mobile Menu Modal */}
			{isMobileMenuOpen && (
				<div className="flex fixed inset-0 z-50 bg-black/50 bg-opacity-50 items-center justify-center backdrop-blur supports-[backdrop-filter]:bg-black/80 md:hidden">
					<div className="bg-white w-4/5 sm:w-80 p-4 rounded-lg shadow-lg">
						<button onClick={toggleMobileMenu} className="absolute top-2 right-2 w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300" aria-label="Close mobile menu">
							✕
						</button>
						<nav className="space-y-4">
							{navigation.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									onClick={toggleMobileMenu}
									className={cn('block px-4 py-2 rounded-lg text-sm font-medium', pathname === item.href ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-primary/10')}
								>
									{item.name}
								</Link>
							))}
						</nav>
					</div>
				</div>
			)}
		</>
	);
}
