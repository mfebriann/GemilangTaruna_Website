'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { menuData, getMenuByCategory } from '@/lib/menu-data';
import { MenuCard } from '../menu/menu-card';
type CategoryFilter = 'all' | 'makanan' | 'minuman';

export function MenuPreview() {
	const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

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
				<MenuCard className="mb-12" items={getFilteredMenu()} />

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
		</section>
	);
}
