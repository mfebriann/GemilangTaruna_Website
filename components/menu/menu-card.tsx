import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight, Clock, Heart, Star } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useFavorites } from '@/contexts/favorites-context';
import { formatCurrency } from '@/lib/utils';
import { MenuItem } from '@/contexts/cart-context';
import { toast, Toaster } from 'react-hot-toast';

export const MenuCard: React.FC<{ items: MenuItem[]; className?: string }> = ({ items, className = '' }) => {
	const [isHydrated, setIsHydrated] = useState(false);
	const { isFavorite, toggleFavorite } = useFavorites();

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	return (
		<div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 ${className}`}>
			<Toaster />
			{items.map((item: MenuItem) => (
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

									toast.dismiss('favorite-toast');

									// Show toast based on previous state
									if (!wasInFavorites) {
										toast(`${item.name} telah ditambahkan ke favorit`, {
											id: 'favorite-toast',
											duration: 1000,
											position: 'top-center',
											icon: '💖',
										});
									} else {
										toast(`${item.name} telah dihapus dari favorit`, {
											id: 'favorite-toast',
											duration: 1000,
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
	);
};
