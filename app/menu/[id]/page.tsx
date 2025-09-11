import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { MenuDetail } from '@/components/menu/menu-detail';
import { getMenuItemById } from '@/lib/menu-data';

interface MenuDetailPageProps {
	params: {
		id: string;
	};
}

export default function MenuDetailPage({ params }: MenuDetailPageProps) {
	const menuItem = getMenuItemById(params.id);

	if (!menuItem) {
		notFound();
	}

	return (
		<div className="min-h-screen">
			<Header />
			<main>
				<MenuDetail menuItem={menuItem} />
			</main>
			<Footer />
		</div>
	);
}
