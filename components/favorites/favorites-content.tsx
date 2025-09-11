'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import { useFavorites } from '@/contexts/favorites-context';
import { formatCurrency } from '@/lib/utils';
import { Toaster } from 'react-hot-toast';

export function FavoritesContent() {
	const { state, dispatch } = useFavorites();

	const handleRemoveFavorite = (menuItemId: string) => {
		dispatch({
			type: 'REMOVE_FAVORITE',
			payload: menuItemId,
		});
	};

	const handleClearFavorites = () => {
		dispatch({ type: 'CLEAR_FAVORITES' });
	};

	if (state.items.length === 0) {
		return (
			<section className="py-16 lg:py-24">
				<div className="container mx-auto px-4">
					<div className="max-w-md mx-auto text-center space-y-6">
						<div className="flex justify-center">
							<div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
								<Heart className="h-12 w-12 text-muted-foreground" />
							</div>
						</div>
						<div className="space-y-2">
							<h1 className="text-2xl font-bold">Belum Ada Favorit</h1>
							<p className="text-muted-foreground">Belum ada menu favorit. Yuk, pilih menu favorit Anda!</p>
						</div>
						<Link href="/menu">
							<Button size="lg">
								<ArrowLeft className="h-4 w-4 mr-2" />
								Lihat Menu
							</Button>
						</Link>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-8 lg:py-12">
			<div className="container mx-auto px-4">
				{/* Header */}
				<div className="flex items-center gap-x-5 justify-between mb-8">
					<div className="space-y-1">
						<h1 className="text-2xl lg:text-3xl font-bold">Menu Favorit</h1>
						<p className="text-muted-foreground">{state.items.length} menu favorit Anda</p>
					</div>
					<Link href="/menu">
						<Button variant="outline">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Lihat Menu
						</Button>
					</Link>
				</div>

				{/* Favorites Grid */}
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{state.items.map((menuItem) => (
							<Card key={menuItem.id} className="group hover:shadow-lg transition-shadow">
								<CardContent className="p-0">
									<Link href={`/menu/${menuItem.id}`}>
										<div className="relative">
											{/* Menu Image */}
											<div className="relative w-full h-48 bg-muted rounded-t-lg overflow-hidden">
												<Image src={menuItem.image || '/placeholder.svg'} alt={menuItem.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
												{/* Availability Badge */}
												{!menuItem.available && (
													<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
														<Badge variant="secondary" className="bg-red-500 text-white">
															Habis
														</Badge>
													</div>
												)}
												{/* Best Seller Badge */}
												{menuItem.bestSeller && <Badge className="absolute top-2 left-2 bg-orange-500 text-white">Best Seller</Badge>}
											</div>

											{/* Menu Info */}
											<div className="p-4 space-y-3">
												<div className="space-y-2">
													<h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{menuItem.name}</h3>
													<p className="text-sm text-muted-foreground line-clamp-2">{menuItem.description}</p>
												</div>

												<div className="flex items-center justify-between">
													<div className="space-y-1">
														<div className="font-bold text-primary text-lg">{formatCurrency(menuItem.price)}</div>
														<Badge variant="secondary" className="capitalize text-xs">
															{menuItem.category}
														</Badge>
													</div>
												</div>
											</div>
										</div>
									</Link>

									<div className="absolute top-2 right-2">
										<Button
											variant="ghost"
											size="icon"
											onClick={(e) => {
												e.preventDefault();
												e.stopPropagation();
												handleRemoveFavorite(menuItem.id);
											}}
											className="bg-white/90 hover:bg-white text-red-500 hover:text-red-600 shadow-sm"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					{/* Clear Favorites Button */}
					<div className="pt-4 text-center">
						<Button variant="outline" onClick={handleClearFavorites} className="text-destructive hover:text-destructive bg-transparent">
							<Trash2 className="h-4 w-4 mr-2" />
							Hapus Semua Favorit
						</Button>
					</div>
				</div>
			</div>
			<Toaster />
		</section>
	);
}
