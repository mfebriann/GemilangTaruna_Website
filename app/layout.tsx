import type React from 'react';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { aboutUs } from '@/lib/utils';
import WhatsAppButton from '@/components/ui/whatsapButton';
import { Providers } from './providers';

export const metadata: Metadata = {
	title: aboutUs.name,
	description: 'Delicious Indonesian street food including Seblak, Ayam Geprek, Kebab, and traditional drinks',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
				<Providers>{children}</Providers>
				<Analytics />
				<WhatsAppButton className="sm:hidden" />
			</body>
		</html>
	);
}
