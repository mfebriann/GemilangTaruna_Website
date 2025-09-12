'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Utensils } from 'lucide-react';
import { menuData, getBestSellers, getCheapestItems, getMenuByCategory } from '@/lib/menu-data';
import { MenuItem } from '@/contexts/cart-context';
import { MenuCard } from './menu-card';

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
							<div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 border rounded-lg p-6 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
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
						<MenuCard items={currentItems} />

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
		</section>
	);
}
