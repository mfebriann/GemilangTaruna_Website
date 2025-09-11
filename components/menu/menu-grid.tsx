'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Clock, ArrowRight, Utensils, Heart } from 'lucide-react';
import { menuData, getBestSellers, getCheapestItems, getMenuByCategory } from '@/lib/menu-data';
import { formatCurrency } from '@/lib/utils';
import { useFavorites } from '@/contexts/favorites-context';
import { toast, Toaster } from 'react-hot-toast';
import { MenuItem } from '@/contexts/cart-context';

type FilterOptions = {
	bestSeller: boolean;
	cheapest: boolean;
	makanan: boolean;
	minuman: boolean;
};

export function MenuGrid() {
	const [filters, setFilters] = useState<FilterOptions>({
		bestSeller: false,
		cheapest: false,
		makanan: false,
		minuman: false,
	});
	const [isHydrated, setIsHydrated] = useState(false);
	const { isFavorite, toggleFavorite } = useFavorites();

	// Ensure component is hydrated before showing favorite states
	useEffect(() => {
		setIsHydrated(true);
	}, []);

	const getMenuItems = () => {
		// If no filters are selected, show all items
		const hasActiveFilters = Object.values(filters).some(Boolean);
		if (!hasActiveFilters) {
			return menuData;
		}

		const filteredItems = new Set<MenuItem>();

		if (filters.bestSeller) {
			getBestSellers().forEach((item) => filteredItems.add(item));
		}
		if (filters.cheapest) {
			getCheapestItems().forEach((item) => filteredItems.add(item));
		}
		if (filters.makanan) {
			getMenuByCategory('makanan').forEach((item) => filteredItems.add(item));
		}
		if (filters.minuman) {
			getMenuByCategory('minuman').forEach((item) => filteredItems.add(item));
		}

		return Array.from(filteredItems);
	};

	const handleFilterChange = (filterKey: keyof FilterOptions, checked: boolean) => {
		setFilters((prev) => ({
			...prev,
			[filterKey]: checked,
		}));
	};

	const filterOptions = [
		{
			key: 'bestSeller' as keyof FilterOptions,
			name: 'Best Seller',
		},
		{
			key: 'cheapest' as keyof FilterOptions,
			name: 'Termurah',
		},
		{
			key: 'makanan' as keyof FilterOptions,
			name: 'Makanan',
		},
		{
			key: 'minuman' as keyof FilterOptions,
			name: 'Minuman',
		},
	];

	const activeFiltersCount = Object.values(filters).filter(Boolean).length;
	const currentItems = getMenuItems();

	return (
		<section className="py-16 lg:py-24">
			<div className="container mx-auto px-4">
				<div className="flex flex-col lg:flex-row gap-8">
					{/* Left Sidebar - Filters */}
					<div className="lg:w-80 lg:flex-shrink-0">
						<div className="sticky top-24">
							<div className="bg-background border rounded-lg p-6 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
								<div>
									<h3 className="text-lg font-semibold mb-2">Filter Menu</h3>
									<p className="text-sm text-muted-foreground">{activeFiltersCount === 0 ? `Menampilkan semua menu` : `${currentItems.length} pilihan tersedia`}</p>
								</div>

								<div className="space-y-3">
									{filterOptions.map((option) => {
										const isChecked = filters[option.key];

										return (
											<div key={option.key} className="flex items-center space-x-3">
												<Checkbox id={option.key} checked={isChecked} onCheckedChange={(checked) => handleFilterChange(option.key, checked as boolean)} />
												<label htmlFor={option.key} className="text-sm font-medium cursor-pointer hover:text-primary transition-colors">
													{option.name}
												</label>
											</div>
										);
									})}
								</div>

								{activeFiltersCount > 0 && (
									<Button variant="outline" size="sm" onClick={() => setFilters({ bestSeller: false, cheapest: false, makanan: false, minuman: false })} className="w-full">
										Reset Filter
									</Button>
								)}
							</div>
						</div>
					</div>

					{/* Right Content - Menu Items */}
					<div className="flex-1">
						<div className="mb-6">
							<h2 className="text-2xl lg:text-3xl font-bold mb-2">{activeFiltersCount === 0 ? 'Semua Menu' : `Filter Menu (${activeFiltersCount} aktif)`}</h2>
						</div>

						{/* Menu Items Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
							{currentItems.map((item) => (
								<Card key={item.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
									<div className="relative aspect-[4/3] overflow-hidden">
										<div className="relative w-full h-full">
											<Image
												src={item.image || '/placeholder.svg'}
												alt={item.name}
												fill
												className={`object-cover group-hover:scale-110 transition-transform duration-500 ${!item.available ? 'grayscale' : ''}`}
												loading="lazy"
												onLoad={(e) => {
													const img = e.target as HTMLImageElement;
													if (img.naturalWidth === 0) {
														img.classList.add('opacity-0');
													} else {
														img.classList.remove('opacity-0');
													}
												}}
											/>
											<Skeleton className="absolute inset-0 -z-10" />
										</div>
										<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

										{/* Love/Favorite Button */}
										<div className="absolute top-3 right-3">
											<Button
												variant="ghost"
												size="icon"
												className={`h-8 w-8 rounded-full backdrop-blur-sm transition-all duration-300 ${
													!isHydrated
														? 'bg-white/20 text-white hover:bg-white/30' // Default state during SSR
														: isFavorite(item.id)
														? 'bg-red-500/90 text-white hover:bg-red-600/90'
														: 'bg-white/20 text-white hover:bg-white/30'
												}`}
												onClick={(e) => {
													e.preventDefault();
													if (!isHydrated) return; // Prevent action during hydration

													const wasInFavorites = isFavorite(item.id);
													toggleFavorite(item);

													// Dismiss any existing toast for this item
													toast.dismiss(`fav-${item.id}`);

													// Show toast based on previous state
													if (!wasInFavorites) {
														toast(`${item.name} ditambahkan ke favorit!`, {
															id: `fav-${item.id}`, // Unique ID per item
															duration: 1500,
															position: 'top-center',
															icon: '❤️',
														});
													} else {
														toast(`${item.name} dihapus dari favorit`, {
															id: `fav-${item.id}`, // Unique ID per item
															duration: 1500,
															position: 'top-center',
															icon: '💔',
														});
													}
												}}
											>
												<Heart className={`h-4 w-4 ${isHydrated && isFavorite(item.id) ? 'fill-current' : ''}`} />
											</Button>
										</div>

										{/* Badges */}
										<div className="absolute top-3 left-3 flex flex-col gap-2">
											{item.bestSeller && (
												<Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-500">
													<Star className="h-3 w-3 mr-1 fill-current" />
													Best Seller
												</Badge>
											)}
											{!item.available && (
												<Badge variant="destructive">
													<Clock className="h-3 w-3 mr-1" />
													Habis
												</Badge>
											)}
											<Badge variant="secondary" className="bg-white/90 text-foreground capitalize">
												{item.category}
											</Badge>
										</div>

										{/* Price */}
										<div className="absolute bottom-3 right-3">
											<Badge className="bg-primary text-primary-foreground text-sm font-semibold">{formatCurrency(item.price)}</Badge>
										</div>

										{/* Overlay Content */}
										<div className="absolute bottom-3 left-3 text-white">
											<h3 className="font-semibold text-lg mb-1">{item.name}</h3>
										</div>
									</div>

									<CardContent className="p-4">
										<div className="space-y-3">
											<p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">{item.description}</p>

											{/* Toppings Info */}
											{item.toppings && item.toppings.length > 0 && (
												<div className="text-xs text-muted-foreground">
													<span className="font-medium">Toppings tersedia:</span> {item.toppings.length} pilihan
												</div>
											)}

											<div className="flex items-center justify-between pt-2">
												<div className="flex items-center space-x-2">
													{item.available ? (
														<Badge variant="outline" className="text-green-600 border-green-600">
															Tersedia
														</Badge>
													) : (
														<Badge variant="outline" className="text-red-600 border-red-600">
															Habis
														</Badge>
													)}
												</div>

												<Link href={`/menu/${item.id}`}>
													<Button size="sm" className="group/btn" disabled={!item.available}>
														Detail
														<ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
													</Button>
												</Link>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>

						{/* Empty State */}
						{currentItems.length === 0 && (
							<div className="text-center py-12">
								<div className="flex justify-center mb-4">
									<div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
										<Utensils className="h-8 w-8 text-muted-foreground" />
									</div>
								</div>
								<h3 className="text-lg font-semibold mb-2">Tidak ada menu tersedia</h3>
								<p className="text-muted-foreground">Maaf, saat ini tidak ada menu yang tersedia untuk filter yang dipilih.</p>
							</div>
						)}
					</div>
				</div>
			</div>
			<Toaster />
		</section>
	);
}
