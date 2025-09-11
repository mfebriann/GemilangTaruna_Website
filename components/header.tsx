'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Heart, ShoppingCart, MessageCircle, Utensils, Menu, Home, NotebookText, Info, Phone } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useFavorites } from '@/contexts/favorites-context';
import { aboutUs, cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

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

	const handleWhatsAppClick = () => {
		const phoneNumber = '6281234567890'; // Replace with actual WhatsApp number
		const message = 'Halo! Saya ingin bertanya tentang menu warung.';
		const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
		window.open(whatsappUrl, '_blank');
	};

	const handleMobileNavClick = () => {
		setIsMobileMenuOpen(false);
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/95">
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between">
					<div className="flex items-center space-x-3">
						<Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
							<SheetTrigger asChild>
								<div>
									<Button variant="ghost" size="icon" className="md:hidden">
										<Menu className="h-5 w-5" />
									</Button>
								</div>
							</SheetTrigger>
							<SheetContent side="left" className="w-4/5 sm:w-80 p-0 [&>button]:hidden md:hidden">
								<div className="flex flex-col h-full">
									<SheetHeader className="p-4 border-b">
										<div className="flex items-center space-x-3">
											<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
												<Utensils className="h-6 w-6" />
											</div>
											<SheetTitle className="text-lg font-bold text-primary">{aboutUs.name}</SheetTitle>
										</div>
									</SheetHeader>

									<div className="flex-1 overflow-y-auto">
										{/* Navigation Links */}
										<nav className="p-4 space-y-2">
											{navigation.map((item) => {
												const Icon = item.icon;
												return (
													<Link
														key={item.name}
														href={item.href}
														onClick={handleMobileNavClick}
														className={cn(
															'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary/10',
															pathname === item.href ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground hover:text-primary'
														)}
													>
														<Icon className="h-5 w-5" />
														<span>{item.name}</span>
													</Link>
												);
											})}
										</nav>

										{/* Quick Actions */}
										<div className="px-6 py-4 border-t">
											<h3 className="text-sm font-semibold text-muted-foreground mb-3">Quick Actions</h3>
											<div className="space-y-2">
												<Link
													href="/favorites"
													onClick={handleMobileNavClick}
													className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary/10 text-foreground hover:text-primary"
												>
													<div className="flex items-center space-x-3">
														<Heart className="h-5 w-5" />
														<span>Favorites</span>
													</div>
													{isHydrated && favoritesState.items.length > 0 && (
														<Badge variant="secondary" className="h-6 w-6 rounded-full p-0 text-xs">
															{favoritesState.items.length}
														</Badge>
													)}
												</Link>

												<Link
													href="/cart"
													onClick={handleMobileNavClick}
													className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary/10 text-foreground hover:text-primary"
												>
													<div className="flex items-center space-x-3">
														<ShoppingCart className="h-5 w-5" />
														<span>Cart</span>
													</div>
													{isHydrated && state.items.length > 0 && (
														<Badge variant="secondary" className="h-6 w-6 rounded-full p-0 text-xs">
															{state.items.reduce((sum, item) => sum + item.quantity, 0)}
														</Badge>
													)}
												</Link>
											</div>
										</div>
									</div>

									{/* WhatsApp Button */}
									<div className="p-6 border-t">
										<Button
											onClick={() => {
												handleWhatsAppClick();
												handleMobileNavClick();
											}}
											className="w-full bg-green-500 hover:bg-green-600 text-white"
										>
											<MessageCircle className="h-4 w-4 mr-2" />
											Contact via WhatsApp
										</Button>
									</div>
								</div>
							</SheetContent>
						</Sheet>

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
							<Button variant="ghost" size="icon" className="relative text-foreground hover:text-primary">
								<Heart className="h-5 w-5" />
								{isHydrated && favoritesState.items.length > 0 && (
									<Badge variant="destructive" className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs">
										{favoritesState.items.length}
									</Badge>
								)}
							</Button>
						</Link>

						{/* Cart */}
						<Link href="/cart">
							<Button variant="ghost" size="icon" className="relative text-foreground hover:text-primary">
								<ShoppingCart className="h-5 w-5" />
								{isHydrated && state.items.length > 0 && (
									<Badge variant="destructive" className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs">
										{state.items.reduce((sum, item) => sum + item.quantity, 0)}
									</Badge>
								)}
							</Button>
						</Link>

						{/* WhatsApp */}
						<Button onClick={handleWhatsAppClick} size="sm" className="bg-green-500 hover:bg-green-600 text-white hidden sm:flex">
							<MessageCircle className="h-4 w-4 mr-2" />
							<span className="hidden sm:inline">WhatsApp</span>
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
