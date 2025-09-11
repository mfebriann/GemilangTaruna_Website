import type { MenuItem } from '@/contexts/cart-context';

export const menuData: MenuItem[] = [
	// Makanan
	{
		id: 'seblak',
		name: 'Seblak',
		price: 15000,
		category: 'makanan',
		image: '/indonesian-seblak-spicy-noodles-with-vegetables.jpg',
		description: 'Seblak pedas dengan kerupuk, sayuran segar, dan bumbu rahasia yang menggugah selera.',
		available: true,
		bestSeller: true,
		stock: 10,
		toppings: [
			{ id: 'sosis', name: 'Sosis', price: 5000 },
			{ id: 'telur', name: 'Telur', price: 3000 },
			{ id: 'bakso', name: 'Bakso', price: 4000 },
		],
	},
	{
		id: 'ayam-geprek',
		name: 'Ayam Geprek',
		price: 18000,
		category: 'makanan',
		image: '/indonesian-ayam-geprek-fried-chicken-with-sambal.jpg',
		description: 'Ayam goreng crispy yang digeprek dengan sambal pedas dan nasi hangat.',
		available: true,
		bestSeller: true,
		stock: 8,
		toppings: [
			{ id: 'keju', name: 'Keju', price: 3000 },
			{ id: 'extra-sambal', name: 'Extra Sambal', price: 2000 },
		],
	},
	{
		id: 'kebab-beef',
		name: 'Kebab Beef',
		price: 20000,
		category: 'makanan',
		image: '/beef-kebab-wrap-with-vegetables-and-sauce.jpg',
		description: 'Kebab daging sapi dengan sayuran segar dan saus spesial dalam roti pita.',
		available: true,
		bestSeller: false,
		stock: 5,
		toppings: [
			{ id: 'extra-daging', name: 'Extra Daging', price: 8000 },
			{ id: 'keju-mozarella', name: 'Keju Mozarella', price: 5000 },
		],
	},
	{
		id: 'pisang',
		name: 'Pisang Goreng',
		price: 8000,
		category: 'makanan',
		image: '/indonesian-fried-banana-golden-crispy.jpg',
		description: 'Pisang goreng crispy dengan tepung bumbu yang gurih dan manis.',
		available: true,
		bestSeller: false,
		stock: 12,
	},
	{
		id: 'pisang-keju',
		name: 'Pisang Keju',
		price: 12000,
		category: 'makanan',
		image: '/indonesian-fried-banana-with-cheese-topping.jpg',
		description: 'Pisang goreng dengan topping keju leleh yang creamy dan lezat.',
		available: true,
		bestSeller: true,
		stock: 7,
	},
	{
		id: 'mie-sarimi',
		name: 'Mie Sarimi',
		price: 10000,
		category: 'makanan',
		image: '/indonesian-instant-noodles-with-egg-and-vegetables.jpg',
		description: 'Mie instan dengan telur, sayuran, dan bumbu yang pas di lidah.',
		available: false,
		bestSeller: false,
		stock: 0,
		toppings: [
			{ id: 'telur-mata-sapi', name: 'Telur Mata Sapi', price: 3000 },
			{ id: 'kornet', name: 'Kornet', price: 5000 },
		],
	},

	// Minuman
	{
		id: 'kopi',
		name: 'Kopi Hitam',
		price: 8000,
		category: 'minuman',
		image: '/indonesian-black-coffee-in-glass.jpg',
		description: 'Kopi hitam asli dengan aroma yang kuat dan rasa yang nikmat.',
		available: true,
		bestSeller: true,
		stock: 20,
	},
	{
		id: 'pop-ice',
		name: 'Pop Ice',
		price: 6000,
		category: 'minuman',
		image: '/colorful-indonesian-pop-ice-drink-with-ice.jpg',
		description: 'Minuman segar dengan berbagai rasa dan es serut yang menyegarkan.',
		available: true,
		bestSeller: true,
		stock: 15,
		toppings: [
			{ id: 'jelly', name: 'Jelly', price: 2000 },
			{ id: 'susu', name: 'Susu', price: 3000 },
			{ id: 'es-krim', name: 'Es Krim', price: 5000 },
		],
	},
	{
		id: 'es-teh',
		name: 'Es Teh Manis',
		price: 5000,
		category: 'minuman',
		image: '/indonesian-iced-sweet-tea-in-glass.jpg',
		description: 'Es teh manis segar yang sempurna untuk menemani makanan pedas.',
		available: true,
		bestSeller: false,
		stock: 25,
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
