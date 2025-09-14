// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { aboutUs } from '@/lib/utils';
import { Home, NotebookText, Info, Phone } from 'lucide-react';

// navigation kamu
const navigation = [
	{ name: 'Home', href: '/', icon: Home },
	{ name: 'Menu', href: '/menu', icon: NotebookText },
	{ name: 'About', href: '/about', icon: Info },
	{ name: 'Contact', href: '/contact', icon: Phone },
];

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
	const base = aboutUs.website;

	return navigation.map((item) => ({
		url: `${base}${item.href}`,
		lastModified: new Date(),
		changeFrequency: item.href === '/' ? 'weekly' : 'monthly',
		priority: item.href === '/' ? 1 : 0.7,
	}));
}
