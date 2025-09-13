import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
	}).format(amount);
}

export const aboutUs = {
	name: 'Gemilang Taruna',
	since: 2023,
	openingHours: '09:00 - 20:00',
	location: 'Jl. Taruna Raya No.12, RT.10/RW.3, Serdang, Kec. Kemayoran, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10650',
	whatsapp: '6283890055830',
};

export const formatWhatsappNumber = () => {
	let cleaned = aboutUs.whatsapp.replace(/\D/g, '');

	if (cleaned.startsWith('62')) {
		cleaned = '+' + cleaned;
	}

	const country = cleaned.slice(0, 3);
	const part1 = cleaned.slice(3, 6);
	const part2 = cleaned.slice(6, 10);
	const part3 = cleaned.slice(10);
	return `${country} ${part1}-${part2}-${part3}`;
};

export const handleWhatsAppOrder = () => {
	const phoneNumber = aboutUs.whatsapp;
	const message = `Halo! Saya ingin memesan makanan dari ${aboutUs.name}.`;
	const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
	window.open(whatsappUrl, '_blank');
};
