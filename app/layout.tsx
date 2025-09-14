// app/layout.tsx
import type React from 'react';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { aboutUs } from '@/lib/utils';
import { Providers } from './providers';

export const metadata: Metadata = {
	metadataBase: new URL(aboutUs.website),
	title: {
		default: aboutUs.name,
		template: `%s | ${aboutUs.name}`,
	},
	description: 'Menyajikan jajanan khas Indonesia seperti Seblak, Ayam Geprek, Kebab, dan minuman tradisional yang lezat dan terjangkau.',
	keywords: ['seblak', 'ayam geprek', 'kebab', 'jajanan warung', 'kuliner Indonesia'],
	alternates: { canonical: '/' },
	icons: { icon: '/favicon.svg' },
	openGraph: {
		type: 'website',
		url: aboutUs.website,
		title: aboutUs.name,
		description: 'Jajanan khas Indonesia enak, terjangkau, dan fresh setiap hari. Cek menu & cara order di sini.',
		siteName: aboutUs.name,
		images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
		locale: 'id_ID',
	},
	twitter: {
		card: 'summary_large_image',
		title: aboutUs.name,
		description: 'Jajanan khas Indonesia enak, terjangkau, dan fresh setiap hari. Cek menu & cara order di sini.',
		images: ['/og-image.jpg'],
	},
	robots: {
		index: true,
		follow: true,
	},
	applicationName: aboutUs.name,
	category: 'Food & Drink',
	verification: {
		google: 'googlebc14674711e6e563',
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="id" suppressHydrationWarning>
			<body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} bg-background text-foreground`}>
				<Providers>{children}</Providers>
				<Analytics />
			</body>
		</html>
	);
}
