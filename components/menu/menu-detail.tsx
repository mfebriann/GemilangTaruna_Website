'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Star, Plus, Minus, ShoppingCart, Clock, Heart } from 'lucide-react';
import type { CartItem, MenuItem, Topping } from '@/contexts/cart-context';
import { useCart } from '@/contexts/cart-context';
import { useFavorites } from '@/contexts/favorites-context';
import { formatCurrency } from '@/lib/utils';
import { toast, Toaster } from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

export interface MenuDetailProps {
	menuItem: MenuItem;
	editItem?: CartItem | null;
}

export function MenuDetail({ menuItem, editItem }: MenuDetailProps) {
	const [selectedToppings, setSelectedToppings] = useState<Array<Topping & { quantity: number }>>([]);
	const [isMounted, setIsMounted] = useState(false);
	const { state, dispatch } = useCart();
	const { isFavorite, toggleFavorite } = useFavorites();
	const searchParams = useSearchParams();
	const isEditMode = searchParams.get('edit') === '1';
	const [quantity, setQuantity] = useState(isEditMode && editItem ? editItem.quantity : 1);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Helper: get topping stock from cart
	function getToppingStock(topping: Topping): number {
		if (!isMounted) return topping.stock;

		if (isEditMode) {
			return topping.stock;
		}

		let used = 0;
		state.items.forEach((item) => {
			if (item.menuItem.id === menuItem.id) {
				item.selectedToppings.forEach((t) => {
					if (t.id === topping.id) {
						used += t.quantity ?? 1;
					}
				});
			}
		});
		return topping.stock - used;
	}

	const totalInCart = state.items.filter((item) => item.menuItem.id === menuItem.id).reduce((sum, item) => sum + item.quantity, 0);
	const totalInCartExcludingEdit = isEditMode && editItem ? totalInCart - editItem.quantity : totalInCart;
	const maxQuantity = isEditMode ? menuItem.stock : menuItem.stock - totalInCartExcludingEdit;

	const handleToppingChange = (topping: Topping, checked: boolean) => {
		const currentStock = getToppingStock(topping);
		if (checked && currentStock > 0) {
			setSelectedToppings([...selectedToppings, { ...topping, quantity: 1 }]);
		} else {
			setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
		}
	};

	const handleToppingQuantity = (toppingId: string, newQty: number, maxStock: number) => {
		setSelectedToppings(selectedToppings.map((t) => (t.id === toppingId ? { ...t, quantity: Math.max(1, Math.min(newQty, maxStock)) } : t)));
	};

	const calculateTotalPrice = () => {
		const toppingsPrice = selectedToppings.reduce((sum, topping) => sum + topping.price * topping.quantity, 0);
		return menuItem.price * quantity + toppingsPrice;
	};

	const handleAddToCart = () => {
		if (!menuItem.available) {
			toast.error('Menu tidak tersedia', {
				duration: 1500,
				position: 'top-center',
			});
			return;
		}
		if (quantity > maxQuantity) {
			toast.error(`Stok tidak cukup. Sisa stok hanya ${maxQuantity}`, {
				duration: 1500,
				position: 'top-center',
			});
			return;
		}

		dispatch({
			type: 'ADD_ITEM',
			payload: {
				menuItem,
				selectedToppings: selectedToppings.map((t) => ({ ...t, quantity: t.quantity ?? 1 })),
				quantity,
			},
		});

		toast.success(`${quantity}x ${menuItem.name} ditambahkan ke keranjang!`, {
			duration: 1500,
			position: 'top-center',
		});

		setQuantity(1);
		setSelectedToppings([]);
	};

	const handleEditOrder = () => {
		const existingItem = state.items.find((item) => item.menuItem.id === menuItem.id);
		if (!existingItem) return;

		dispatch({
			type: 'EDIT_ITEM',
			payload: {
				id: existingItem.id,
				menuItem,
				selectedToppings: selectedToppings.map((t) => ({ ...t, quantity: t.quantity ?? 1 })),
				quantity,
			},
		});

		toast.success(`${menuItem.name} berhasil diubah!`, {
			duration: 1500,
			position: 'top-center',
		});
	};

	return (
		<section className="py-8 lg:py-12">
			<div className="container mx-auto px-4">
				{/* Back Button */}
				<div className="mb-8">
					<Link href="/menu">
						<Button variant="ghost" className="mb-4">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Kembali ke Menu
						</Button>
					</Link>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Left Column - Image */}
					<div className="space-y-4">
						<div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
							<Image src={menuItem.image || '/placeholder.svg'} alt={menuItem.name} fill className="object-cover" priority />
							<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

							{/* Favorite Button */}
							<div className="absolute top-4 right-4">
								<Button
									variant="ghost"
									size="icon"
									className={`h-10 w-10 rounded-full backdrop-blur-sm transition-all duration-300 ${isFavorite(menuItem.id) ? 'bg-red-500/90 text-white hover:bg-red-600/90' : 'bg-white/20 text-white hover:bg-white/30'}`}
									onClick={() => {
										toggleFavorite(menuItem);
										setTimeout(() => {
											if (isFavorite(menuItem.id)) {
												toast.success(`${menuItem.name} ditambahkan ke favorit!`, {
													duration: 1500,
													position: 'top-center',
												});
											} else {
												toast.error(`${menuItem.name} dihapus dari favorit`, {
													duration: 1500,
													position: 'top-center',
												});
											}
										}, 100);
									}}
								>
									<Heart className={`h-5 w-5 transition-all duration-300 ${isFavorite(menuItem.id) ? 'fill-current' : ''}`} />
								</Button>
							</div>

							{/* Badges */}
							<div className="absolute top-4 left-4 flex flex-col gap-2">
								{menuItem.bestSeller && (
									<Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-500">
										<Star className="h-3 w-3 mr-1 fill-current" />
										Best Seller
									</Badge>
								)}
								<Badge variant="secondary" className="capitalize">
									{menuItem.category}
								</Badge>
							</div>

							{/* Availability */}
							<div className="absolute bottom-4 right-4">
								{menuItem.available ? (
									<Badge className="bg-green-500 text-white">Tersedia</Badge>
								) : (
									<Badge variant="destructive">
										<Clock className="h-3 w-3 mr-1" />
										Habis
									</Badge>
								)}
							</div>
						</div>
					</div>

					{/* Right Column - Details */}
					<div className="space-y-6">
						<div className="space-y-4">
							<h1 className="text-3xl lg:text-4xl font-bold">{menuItem.name}</h1>
							<p className="text-lg text-muted-foreground">{menuItem.description}</p>
							<div className="text-2xl font-bold text-primary">{formatCurrency(menuItem.price)}</div>
						</div>

						{/* Toppings Selection */}
						{menuItem.toppings && menuItem.toppings.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Pilih Toppings (Opsional)</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{menuItem.toppings.map((topping) => {
										const selected = selectedToppings.find((t) => t.id === topping.id);
										const currentStock = getToppingStock(topping);
										const isOutOfStock = currentStock <= 0;
										return (
											<div key={topping.id} className="flex items-center justify-between">
												<div className="flex items-center space-x-3">
													<Checkbox id={topping.id} checked={!!selected} onCheckedChange={(checked) => handleToppingChange(topping, checked as boolean)} disabled={isOutOfStock} />
													<label htmlFor={topping.id} className={`text-sm font-medium cursor-pointer ${isOutOfStock ? 'text-destructive' : ''}`}>
														{topping.name} {isOutOfStock && '(Habis)'}
													</label>
													{!!selected && (
														<div className="flex items-center space-x-1 ml-2">
															<Button variant="outline" size="icon" onClick={() => handleToppingQuantity(topping.id, selected.quantity - 1, currentStock)} disabled={selected.quantity <= 1}>
																<Minus className="h-3 w-3" />
															</Button>
															<span className="text-sm font-semibold w-6 text-center">{selected.quantity}</span>
															<Button variant="outline" size="icon" onClick={() => handleToppingQuantity(topping.id, selected.quantity + 1, currentStock)} disabled={selected.quantity >= currentStock}>
																<Plus className="h-3 w-3" />
															</Button>
															<span className="text-xs text-muted-foreground ml-2">Stok: {currentStock - selected.quantity}</span>
														</div>
													)}
												</div>
												<span className="text-sm text-muted-foreground">+{formatCurrency(topping.price)}</span>
											</div>
										);
									})}
								</CardContent>
							</Card>
						)}

						{/* Quantity Selector */}
						<Card>
							<CardContent className="p-4">
								<div className="flex items-center justify-between">
									<span className="font-medium">Jumlah</span>
									<div className="flex items-center space-x-3">
										<Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={!isMounted || quantity <= 1}>
											<Minus className="h-4 w-4" />
										</Button>
										<span className="text-lg font-semibold w-8 text-center">{quantity}</span>
										<Button variant="outline" size="icon" onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))} disabled={!isMounted || quantity >= maxQuantity}>
											<Plus className="h-4 w-4" />
										</Button>
									</div>
								</div>
								{isMounted && (
									<div className="mt-2 text-sm text-muted-foreground">
										Sisa stok: <span className="font-bold text-primary">{maxQuantity}</span>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Price Summary */}
						<Card className="bg-muted/50">
							<CardContent className="p-4 space-y-3">
								<div className="flex justify-between text-sm">
									<span>Harga dasar ({quantity}x)</span>
									<span>{formatCurrency(menuItem.price * quantity)}</span>
								</div>
								{selectedToppings.length > 0 && (
									<>
										<Separator />
										<div className="space-y-1">
											<div className="text-sm font-medium">Toppings:</div>
											{selectedToppings.map((topping) => (
												<div key={topping.id} className="flex justify-between text-sm">
													<span>
														• {topping.name} ({topping.quantity}x)
													</span>
													<span>{formatCurrency(topping.price * topping.quantity)}</span>
												</div>
											))}
										</div>
									</>
								)}
								<Separator />
								<div className="flex justify-between text-lg font-bold">
									<span>Total</span>
									<span className="text-primary">{formatCurrency(calculateTotalPrice())}</span>
								</div>
							</CardContent>
						</Card>

						{/* Add to Cart Button */}
						{isEditMode ? (
							<Button onClick={handleEditOrder} size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={!isMounted || !menuItem.available}>
								<ShoppingCart className="h-5 w-5 mr-2" />
								Ubah Pesanan
							</Button>
						) : (
							<Button onClick={handleAddToCart} size="lg" className="w-full" disabled={!isMounted || !menuItem.available || maxQuantity <= 0}>
								<ShoppingCart className="h-5 w-5 mr-2" />
								Tambah ke Keranjang
							</Button>
						)}

						{maxQuantity <= 0 && <p className="text-sm text-destructive text-center mt-2">Stok habis, tidak bisa menambah ke keranjang.</p>}
						{!menuItem.available && <p className="text-sm text-muted-foreground text-center">Maaf, menu ini sedang tidak tersedia. Silakan pilih menu lainnya.</p>}
					</div>
				</div>
			</div>
			<Toaster />
		</section>
	);
}
