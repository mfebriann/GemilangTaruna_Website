import type { MenuItem } from '@/contexts/cart-context';
import { formatCurrency } from '@/lib/utils';

export const menuData: MenuItem[] = [
	{
		id: 'seblak',
		name: 'Seblak',
		price: 0,
		category: 'makanan',
		image: '/indonesian-seblak-spicy-noodles-with-vegetables.webp',
		description: 'Seblak pedas dengan kerupuk, sayuran segar, dan bumbu rahasia yang menggugah selera.',
		available: true,
		bestSeller: true,
		stock: '-',
		minToppingsRequired: 1,
		toppings: [
			{ id: 'seblak-mie', name: 'Mie', price: 2000, stock: '-', autoSelect: true, main: true },
			{ id: 'seblak-sosis-ayam-panjang', name: 'Sosis Ayam (Panjang)', price: 2000, stock: '-' },
			{ id: 'seblak-telur', name: 'Telor', price: 4000, stock: '-' },
			{ id: 'seblak-ekor-udang', name: 'Ekor Udang', price: 2000, stock: '-' },
			{ id: 'seblak-dumpling', name: 'Dumpling (Chicken/Chess)', price: 3000, stock: '-' },
			{ id: 'seblak-sosis-ayam-kecil', name: 'Sosis Ayam (Kecil)', price: 2000, stock: '-' },
			{ id: 'seblak-fish-roll', name: 'Fish Roll', price: 2000, stock: '-' },
			{ id: 'seblak-kerupuk-oren', name: 'Kerupuk Oren', price: 2000, stock: '-' },
			{ id: 'seblak-kerupuk-tambang', name: 'Kerupuk Tambang', price: 2000, stock: '-' },
			{ id: 'seblak-makaroni', name: 'Makaroni', price: 2000, stock: '-' },
			{ id: 'seblak-scallop', name: 'Scallop', price: 2000, stock: '-' },
			{ id: 'seblak-chikuwa', name: 'Chikuwa', price: 2000, stock: '-' },
			{ id: 'seblak-odeng', name: 'Odeng', price: 2000, stock: '-' },
			{ id: 'seblak-bakso', name: 'Bakso', price: 1500, stock: '-' },
		],
	},
	{
		id: 'ayam-geprek',
		name: 'Ayam Geprek',
		price: 8000,
		category: 'makanan',
		image: '/indonesian-ayam-geprek-fried-chicken-with-sambal.webp',
		description: 'Ayam goreng crispy yang digeprek dengan sambal pedas dan nasi hangat.',
		available: true,
		bestSeller: true,
		stock: '-',
		toppings: [
			{ id: 'ayam-geprek-timun', name: 'Timun', price: 0, stock: '-' },
			{ id: 'ayam-geprek-sambal', name: 'Sambal', price: 0, stock: '-' },
			{ id: 'ayam-geprek-nasi', name: 'Nasi', price: 2000, stock: '-' },
		],
	},
	{
		id: 'kebab-beef',
		name: 'Kebab Beef',
		price: 10000,
		category: 'makanan',
		image: '/beef-kebab-wrap-with-vegetables-and-sauce.webp',
		description: 'Kebab daging sapi dengan sayuran segar dan saus di dalamnya.',
		available: true,
		bestSeller: true,
		stock: '-',
		toppings: [
			{ id: 'kebab-beef-timun', name: 'Timun', price: 0, stock: '-' },
			{ id: 'kebab-beef-selada', name: 'Selada', price: 0, stock: '-' },
			{ id: 'kebab-beef-saos', name: 'Saos', price: 0, stock: '-' },
			{ id: 'kebab-beef-mayonnaise', name: 'Mayonnaise', price: 0, stock: '-' },
			{ id: 'kebab-beef-tomat', name: 'Tomat', price: 0, stock: '-' },
		],
	},
	{
		id: 'kebab-pisang',
		name: 'Kebab Pisang',
		price: 10000,
		category: 'makanan',
		image: '/indonesian-fried-banana-with-chocolate.webp',
		description: 'Kebab isi pisang dengan tambahan topping manis.',
		available: true,
		bestSeller: false,
		stock: '-',
		toppings: [
			{ id: 'kebab-pisang-keju', name: 'Keju', price: 2000, stock: '-' },
			{ id: 'kebab-pisang-meses', name: 'Meses Ceres', price: 2000, stock: '-' },
		],
	},
	{
		id: 'pisang-keju',
		name: 'Pisang Keju',
		price: 5000,
		category: 'makanan',
		image: '/indonesian-fried-banana-with-cheese-topping.webp',
		description: 'Pisang goreng dengan topping keju dan meses.',
		available: true,
		bestSeller: false,
		stock: '-',
		toppings: [
			{ id: 'pisang-keju-meses', name: 'Meses Ceres', price: 2000, stock: '-' },
			{ id: 'pisang-keju-keju', name: 'Keju', price: 2000, stock: '-' },
			{ id: 'pisang-keju-susu', name: 'Susu Coklat Putih', price: 0, stock: '-' },
		],
	},
	{
		id: 'mie-sarimi',
		name: 'Mie Sarimi',
		price: 5000,
		category: 'makanan',
		image: '/indonesian-instant-noodles-with-egg-and-vegetables.webp',
		description: 'Mie instan dengan topping tambahan sesuai selera.',
		available: true,
		bestSeller: false,
		stock: '-',
		toppings: [
			{ id: 'mie-sarimi-saos', name: 'Saos', price: 0, stock: '-' },
			{ id: 'mie-sarimi-sosis-ayam-panjang', name: 'Sosis Ayam (Panjang)', price: 2000, stock: '-' },
			{ id: 'mie-sarimi-sosis-ayam-kecil', name: 'Sosis Ayam (Kecil)', price: 2000, stock: '-' },
			{ id: 'mie-sarimi-telor', name: 'Telor', price: 4000, stock: '-' },
			{ id: 'mie-sarimi-bakso', name: 'Bakso', price: 1500, stock: '-' },
		],
	},
	{
		id: 'good-day',
		name: 'Good Day',
		price: 5000,
		category: 'minuman',
		image: '/indonesian-coffee-good-day.webp',
		description: 'Minuman kopi Good Day yang manis dan menyegarkan.',
		available: true,
		bestSeller: false,
		stock: '-',
	},
	{
		id: 'ovaltine',
		name: 'Ovaltine',
		price: 5000,
		category: 'minuman',
		image: '/ovaltine.webp',
		description: 'Minuman cokelat Ovaltine yang creamy dan lezat.',
		available: true,
		bestSeller: false,
		stock: '-',
	},
	{
		id: 'nutrisari',
		name: 'Nutrisari',
		price: 5000,
		category: 'minuman',
		image: '/nutrisari.webp',
		description: 'Minuman segar Nutrisari rasa jeruk.',
		available: true,
		bestSeller: false,
		stock: '-',
	},
	{
		id: 'kopi-hitam',
		name: 'Kopi Hitam',
		price: 4000,
		category: 'minuman',
		image: '/indonesian-black-coffee-in-glass.webp',
		description: 'Kopi hitam asli dengan aroma yang kuat dan rasa nikmat.',
		available: true,
		bestSeller: false,
		stock: '-',
	},
	{
		id: 'pop-ice',
		name: 'Pop Ice',
		price: 5000,
		category: 'minuman',
		image: '/pop-ice.webp',
		description: 'Minuman segar Pop Ice dengan berbagai rasa.',
		available: true,
		bestSeller: true,
		stock: '-',
		toppings: [
			{ id: 'pop-ice-keju', name: 'Keju', price: 2000, stock: '-' },
			{ id: 'pop-ice-meses', name: 'Meses Ceres', price: 2000, stock: '-' },
		],
	},
	{
		id: 'es-teh',
		name: 'Es Teh Manis',
		price: 3000,
		category: 'minuman',
		image: '/indonesian-iced-sweet-tea-in-glass.webp',
		description: 'Es teh manis segar, cocok untuk menemani makanan pedas.',
		available: true,
		bestSeller: true,
		stock: '-',
	},
];

export const getMenuByCategory = (category: 'makanan' | 'minuman') => {
	return menuData.filter((item) => item.category === category);
};

export const getBestSellers = () => {
	return menuData.filter((item) => item.bestSeller && item.available);
};

export const getCheapestItems = () => {
	return menuData
		.filter((item) => item.available)
		.sort((a, b) => a.price - b.price)
		.slice(0, 6);
};

export const getMenuItemById = (id: string) => {
	return menuData.find((item) => item.id === id);
};

// Helper untuk menampilkan harga menu: 0 => "Gratis"
export const formatMenuPrice = (price: number) => (price === 0 ? 'Gratis' : formatCurrency(price));
