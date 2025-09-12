'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, MessageCircle } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { aboutUs, formatCurrency } from '@/lib/utils';
import { toast, Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';

export function CartContent() {
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
				message += `   Topping: ${item.selectedToppings.map((t) => t.name).join(', ')}\n`;
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
										<div className="flex flex-wrap gap-5">
											{/* Item Image */}
											<Link href={`/menu/${item.menuItem.id}`} className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
												<Image src={item.menuItem.image || '/placeholder.svg'} alt={item.menuItem.name} fill className="object-cover" />
											</Link>
											{/* Item Details */}
											<div className="flex-1 space-y-2">
												<div className="flex items-start justify-between">
													<div>
														<h3 className="font-semibold">{item.menuItem.name}</h3>
														{item.selectedToppings.length > 0 && <p className="text-sm text-muted-foreground">+ {item.selectedToppings.map((t) => t.name).join(', ')}</p>}
														<Badge variant="secondary" className="mt-1 capitalize">
															{item.menuItem.category}
														</Badge>
													</div>
													<Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)} className="text-destructive hover:text-destructive">
														<Trash2 className="h-4 w-4" />
													</Button>
												</div>

												{/* Quantity and Price */}
												<div className="flex flex-wrap gap-3 justify-between sm:flex-row sm:items-center">
													<div className="flex items-center flex-wrap gap-3 space-x-2">
														<div className="flex items-center space-x-2">
															<Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={!isMounted || item.quantity <= 1}>
																<Minus className="h-3 w-3" />
															</Button>
															<span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
															<Button
																variant="outline"
																size="icon"
																className="h-8 w-8 bg-transparent"
																onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
																disabled={
																	!isMounted ||
																	(() => {
																		// Hitung total quantity yang sudah ada di cart untuk menu yang sama
																		const totalQtyInCart = state.items
																			.filter(
																				(cartItem) => cartItem.menuItem.id === item.menuItem.id && cartItem.id !== item.id // Exclude current item
																			)
																			.reduce((sum, cartItem) => sum + cartItem.quantity, 0);

																		// Cek apakah penambahan quantity akan melebihi stock
																		return item.quantity + totalQtyInCart >= item.menuItem.stock;
																	})()
																}
															>
																<Plus className="h-3 w-3" />
															</Button>
														</div>
													</div>
													<div className="sm:text-right">
														<div className="font-semibold">{formatCurrency(item.totalPrice)}</div>
														<div className="text-xs text-muted-foreground">{formatCurrency(item.totalPrice / item.quantity)} per item</div>
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
						<Card className="sticky top-4">
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
													{item.selectedToppings.length > 0 && <span className="text-muted-foreground"> + {item.selectedToppings.map((t) => t.name).join(', ')}</span>}
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
