'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, MessageCircle } from 'lucide-react';
import { Edit } from 'lucide-react';
import { CartItem, MenuItem, Topping, useCart } from '@/contexts/cart-context';
import { aboutUs, formatCurrency } from '@/lib/utils';
import { toast, Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

export function CartContent() {
	// Helper to build edit URL with quantity and topping quantities
	function buildEditUrl(item: CartItem) {
		const params = new URLSearchParams();
		params.set('edit', '1');
		params.set('quantity', String(item.quantity));
		item.selectedToppings.forEach((topping: Topping) => {
			params.set(`topping_${topping.id}`, String(topping.quantity ?? 1));
		});
		return `/menu/${item.menuItem.id}?${params.toString()}`;
	}
	const { state, dispatch } = useCart();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null; // atau loading skeleton
	}

	const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
		toast.dismiss('quantity-set-toast');
		dispatch({
			type: 'UPDATE_QUANTITY',
			payload: { id: itemId, quantity: newQuantity },
		});
		toast('Jumlah item diubah', {
			id: 'quantity-set-toast',
			duration: 1500,
			position: 'top-center',
			icon: '🔢',
			iconTheme: { primary: '#000', secondary: '#fff' },
			ariaProps: { role: 'status', 'aria-live': 'polite' },
			removeDelay: 1000,
			toasterId: 'default',
		});
	};

	const handleRemoveItem = (itemId: string) => {
		dispatch({
			type: 'REMOVE_ITEM',
			payload: itemId,
		});
		toast('Item dihapus dari keranjang', {
			duration: 1500,
			position: 'top-center',
			icon: '🗑️',
			iconTheme: { primary: '#000', secondary: '#fff' },
			ariaProps: { role: 'status', 'aria-live': 'polite' },
			removeDelay: 1000,
			toasterId: 'default',
		});
	};

	const handleCheckout = () => {
		if (state.items.length === 0) {
			toast('Keranjang kosong. Tambahkan item terlebih dahulu.', {
				duration: 2000,
				position: 'top-center',
				icon: '🛒',
				iconTheme: { primary: '#000', secondary: '#fff' },
				ariaProps: { role: 'status', 'aria-live': 'polite' },
				removeDelay: 1000,
				toasterId: 'default',
			});
			return;
		}

		let message = '*PESANAN DARI WEBSITE*\n\n';
		state.items.forEach((item, index) => {
			message += `${index + 1}. ${item.menuItem.name}\n`;
			message += `   Jumlah: ${item.quantity}x\n`;
			message += `   Harga: ${formatCurrency(item.totalPrice)}\n`;
			if (item.selectedToppings.length > 0) {
				message += `   Topping: ${item.selectedToppings.map((t) => `${t.name}${(t.quantity ?? 1) > 1 ? ` (${t.quantity ?? 1}x)` : ''}`).join(', ')}\n`;
			}
			message += `\n`;
		});
		message += `*TOTAL: ${formatCurrency(state.total)}*\n\n`;
		message += 'Mohon konfirmasi pesanan ini. Terima kasih!';
		const whatsappUrl = `https://wa.me/${aboutUs.whatsapp}?text=${encodeURIComponent(message)}`;
		window.open(whatsappUrl, '_blank');
		toast('Pesanan dikirim via WhatsApp!', {
			duration: 2000,
			position: 'top-center',
			icon: '📤',
			iconTheme: { primary: '#000', secondary: '#fff' },
			ariaProps: { role: 'status', 'aria-live': 'polite' },
			removeDelay: 1000,
			toasterId: 'default',
		});
	};

	const handleClearCart = () => {
		dispatch({ type: 'CLEAR_CART' });
		toast('Keranjang dikosongkan', {
			duration: 2000,
			position: 'top-center',
			icon: '🧹',
			iconTheme: { primary: '#000', secondary: '#fff' },
			ariaProps: { role: 'status', 'aria-live': 'polite' },
			removeDelay: 1000,
			toasterId: 'default',
		});
	};

	if (!isMounted) {
		// Hindari render konten sebelum client mount
		return null;
	}
	if (!Array.isArray(state?.items) || state.items.length === 0) {
		return (
			<section className="py-16 lg:py-24">
				<div className="container mx-auto px-4">
					<div className="max-w-md mx-auto text-center space-y-6">
						<div className="flex justify-center">
							<div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
								<ShoppingCart className="h-12 w-12 text-muted-foreground" />
							</div>
						</div>
						<div className="space-y-2">
							<h1 className="text-2xl font-bold">Keranjang Kosong</h1>
							<p className="text-muted-foreground">Belum ada item di keranjang Anda. Yuk, pilih menu favorit!</p>
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
				<div className="flex items-center justify-between mb-8">
					<div className="space-y-1">
						<h1 className="text-2xl lg:text-3xl font-bold">Keranjang Belanja</h1>
						<p className="text-muted-foreground">{Array.isArray(state?.items) ? state.items.reduce((sum, item) => sum + item.quantity, 0) : 0} item dalam keranjang</p>
					</div>
					<Link href="/menu">
						<Button variant="outline">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Lanjut Belanja
						</Button>
					</Link>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Cart Items */}
					<div className="lg:col-span-2 space-y-4">
						{Array.isArray(state?.items) &&
							state.items.map((item) => (
								<Card key={item.id}>
									<CardContent className="p-4">
										<div className="flex flex-col sm:flex-row gap-5">
											{/* Item Image */}
											<Link href={`/menu/${item.menuItem.id}`} className="relative w-full h-auto aspect-[4/3] sm:aspect-auto sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
												<Image src={item.menuItem.image || '/placeholder.svg'} alt={item.menuItem.name} fill className="object-cover" />
											</Link>
											{/* Item Details */}
											<div className="flex-1 space-y-2">
												<div className="flex flex-wrap gap-2 items-start justify-between">
													<div className="space-y-1">
														<div>
															<h3 className="font-semibold">
																{item.menuItem.name} ({item.quantity}x)
															</h3>
															{item.selectedToppings.length > 0 && <p className="text-sm text-muted-foreground">+ {item.selectedToppings.map((t) => `${t.name}${(t.quantity ?? 1) > 1 ? ` (${t.quantity ?? 1}x)` : ''}`).join(', ')}</p>}
														</div>
														<div className="font-semibold">{formatCurrency(item.totalPrice)}</div>
													</div>
													<div className="space-y-1">
														<Badge variant="secondary" className="mt-1 capitalize">
															{item.menuItem.category}
														</Badge>
														<div className="flex gap-2">
															<Link href={buildEditUrl(item)}>
																<Button variant="ghost" size="icon" aria-label="Edit">
																	<Edit className="h-4 w-4" />
																</Button>
															</Link>
															<Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} className="text-destructive hover:text-destructive">
																<Trash2 className="h-4 w-4" />
															</Button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))}

						{/* Clear Cart Button */}
						<div className="pt-4">
							<Button variant="outline" onClick={handleClearCart} className="text-destructive hover:text-destructive bg-transparent" disabled={!isMounted}>
								<Trash2 className="h-4 w-4 mr-2" />
								Kosongkan Keranjang
							</Button>
						</div>
					</div>

					{/* Order Summary */}
					<div className="space-y-6">
						<Card className="sticky top-20">
							<CardHeader>
								<CardTitle>Ringkasan Pesanan</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{/* Items Summary */}
								<div className="space-y-2">
									{Array.isArray(state?.items) &&
										state.items.map((item) => (
											<div key={item.id} className="flex justify-between text-sm">
												<span>
													{item.quantity}x {item.menuItem.name}
													{item.selectedToppings.length > 0 && <span className="text-muted-foreground"> + {item.selectedToppings.map((t) => `${t.name}${(t.quantity ?? 1) > 1 ? ` (${t.quantity ?? 1}x)` : ''}`).join(', ')}</span>}
												</span>
												<span>{formatCurrency(item.totalPrice)}</span>
											</div>
										))}
								</div>

								<Separator />

								{/* Total */}
								<div className="flex justify-between text-lg font-bold">
									<span>Total</span>
									<span className="text-primary">{formatCurrency(state.total)}</span>
								</div>

								{/* Checkout Button */}
								<Button onClick={handleCheckout} size="lg" className="w-full">
									<MessageCircle className="h-5 w-5 mr-2" />
									Pesan via WhatsApp
								</Button>

								<p className="text-xs text-muted-foreground text-center">Dengan menekan tombol di atas, pesanan akan dikirim ke WhatsApp kami untuk konfirmasi lebih lanjut.</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
			<Toaster />
		</section>
	);
}
