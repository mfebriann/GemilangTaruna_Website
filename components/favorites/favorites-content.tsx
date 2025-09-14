'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft, Trash2 } from 'lucide-react';
import { useFavorites } from '@/contexts/favorites-context';
import { MenuCard } from '../menu/menu-card';

export function FavoritesContent() {
	const { state, dispatch } = useFavorites();

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
					<MenuCard items={state.items} />

					{/* Clear Favorites Button */}
					<div className="pt-4 text-center">
						<Button variant="outline" onClick={handleClearFavorites} className="text-destructive hover:text-destructive bg-transparent">
							<Trash2 className="h-4 w-4 mr-2" />
							Hapus Semua Favorit
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
