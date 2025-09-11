'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Clock, ArrowRight, Heart } from 'lucide-react';
import { menuData, getMenuByCategory } from '@/lib/menu-data';
import { formatCurrency } from '@/lib/utils';
import { useFavorites } from '@/contexts/favorites-context';
import { toast, Toaster } from 'react-hot-toast';

type CategoryFilter = 'all' | 'makanan' | 'minuman';

export function MenuPreview() {
	const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
	const { isFavorite, toggleFavorite } = useFavorites();
	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	const getFilteredMenu = () => {
		if (activeCategory === 'all') {
			return menuData.filter((item) => item.available).slice(0, 6);
		}
		return getMenuByCategory(activeCategory)
			.filter((item) => item.available)
			.slice(0, 6);
	};

	const categories = [
		{ id: 'all' as CategoryFilter, name: 'Semua', count: menuData.filter((item) => item.available).length },
		{
			id: 'makanan' as CategoryFilter,
			name: 'Makanan',
			count: getMenuByCategory('makanan').filter((item) => item.available).length,
		},
		{
			id: 'minuman' as CategoryFilter,
			name: 'Minuman',
			count: getMenuByCategory('minuman').filter((item) => item.available).length,
		},
	];

	return (
		<section className="py-16 lg:py-24">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<div className="text-center space-y-4 mb-12">
					<h2 className="text-3xl lg:text-4xl font-bold text-balance">
						Menu <span className="text-primary">Favorit</span> Kami
					</h2>
					<p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">Pilihan terbaik dari dapur kami yang selalu fresh dan lezat setiap hari</p>
				</div>

				{/* Category Filter */}
				<div className="flex flex-wrap justify-center gap-2 mb-8">
					{categories.map((category) => (
						<Button
							key={category.id}
							variant="outline"
							onClick={() => setActiveCategory(category.id)}
							className={`rounded-full border-2 transition-all duration-200 ${
								activeCategory === category.id
									? 'bg-green-700 text-white border-green-700 hover:bg-green-800 hover:text-white [&>*]:text-white'
									: 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900 [&>*]:text-gray-700'
							}`}
							style={activeCategory === category.id ? { backgroundColor: '#15803d', color: 'white', borderColor: '#15803d' } : { backgroundColor: 'white', color: '#374151', borderColor: '#d1d5db' }}
						>
							{category.name}
							{/* <Badge
                variant="outline"
                className={`ml-2 border ${
                  activeCategory === category.id
                    ? "bg-white text-green-700 border-white"
                    : "bg-gray-100 text-gray-600 border-gray-300"
                }`}
                style={
                  activeCategory === category.id
                    ? { backgroundColor: "white", color: "#15803d", borderColor: "white" }
                    : { backgroundColor: "#f3f4f6", color: "#4b5563", borderColor: "#d1d5db" }
                }
              >
                {category.count}
              </Badge> */}
						</Button>
					))}
				</div>

				{/* Menu Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
					{getFilteredMenu().map((item) => (
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

				{/* View All Button */}
				<div className="text-center">
					<Link href="/menu">
						<Button size="lg" variant="outline">
							Lihat Semua Menu
							<ArrowRight className="ml-2 h-4 w-4" />
						</Button>
					</Link>
				</div>
			</div>
			<Toaster />
		</section>
	);
}
