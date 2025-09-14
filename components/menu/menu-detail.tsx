'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Star, Plus, Minus, ShoppingCart, Clock, Heart, CircleSlash2, StarHalf } from 'lucide-react';
import type { CartItem, MenuItem, Topping } from '@/contexts/cart-context';
import { toNumericStock, useCart } from '@/contexts/cart-context';
import { useFavorites } from '@/contexts/favorites-context';
import { formatCurrency } from '@/lib/utils';
import { toast, Toaster } from 'react-hot-toast';
import { useSearchParams, useRouter } from 'next/navigation';
import { useShop } from '@/contexts/shop-context';

export interface MenuDetailProps {
	menuItem: MenuItem & { rating?: number; ratingCount?: number };
	editItem?: CartItem | null;
}

function Stars({ value, size = 18 }: { value: number; size?: number }) {
	const full = Math.floor(value);
	const hasHalf = value % 1 >= 0.5;
	const stars = [1, 2, 3, 4, 5];

	return (
		<div className="flex items-center gap-1" aria-label={`Rating ${value.toFixed(1)} dari 5`}>
			{stars.map((i) => {
				if (i <= full) {
					return <Star key={i} className="fill-current text-yellow-500" style={{ width: size, height: size }} />;
				}
				if (i === full + 1 && hasHalf) {
					return <StarHalf key={i} className="fill-current text-yellow-500" style={{ width: size, height: size }} />;
				}
				return <Star key={i} className="text-muted-foreground/30" style={{ width: size, height: size }} />;
			})}
		</div>
	);
}

export function MenuDetail({ menuItem, editItem }: MenuDetailProps) {
	const [selectedToppings, setSelectedToppings] = useState<Array<Topping & { quantity: number }>>([]);
	const [isMounted, setIsMounted] = useState(false);
	const { state, dispatch } = useCart();
	const { isFavorite, toggleFavorite } = useFavorites();
	const searchParams = useSearchParams();
	const isEditMode = searchParams.get('edit') === '1';
	const itemId = searchParams.get('itemId') || undefined;
	const [quantity, setQuantity] = useState(isEditMode && editItem ? editItem.quantity : 1);
	const router = useRouter();
	const { state: shop } = useShop();
	const isShopOpen = shop.isOpenEffective;

	const editingItem = isEditMode ? editItem ?? state.items.find((i) => i.id === itemId) : null;
	const baseAutoTopping = (menuItem.toppings ?? []).find((t) => t.autoSelect) || null;

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isEditMode) return;

		if (editingItem) {
			setQuantity(editingItem.quantity);
			setSelectedToppings((editingItem.selectedToppings ?? []).map((t) => ({ ...t, quantity: t.quantity ?? 1 })));
			return;
		}

		const q = Number(searchParams.get('quantity') || '1');
		setQuantity(Math.max(1, isNaN(q) ? 1 : q));

		if (menuItem.toppings?.length) {
			const tops: Array<Topping & { quantity: number }> = [];
			for (const t of menuItem.toppings) {
				const param = searchParams.get(`topping_${t.id}`);
				if (param) {
					const qty = Math.max(1, Number(param) || 1);
					tops.push({ ...t, quantity: qty });
				}
			}
			setSelectedToppings(tops);
		}
	}, [isEditMode, editingItem?.id, menuItem.id, searchParams, menuItem.toppings]);

	useEffect(() => {
		if (!isMounted) return;
		if (!baseAutoTopping) return;

		setSelectedToppings((prev) => {
			const exists = prev.some((p) => p.id === baseAutoTopping.id);
			if (exists) {
				return prev.map((p) => (p.id === baseAutoTopping.id ? { ...p, quantity } : p));
			}
			return [...prev, { ...baseAutoTopping, quantity }];
		});
	}, [isMounted, menuItem.id]);

	useEffect(() => {
		if (!baseAutoTopping) return;
		setSelectedToppings((prev) => prev.map((p) => (p.id === baseAutoTopping.id ? { ...p, quantity } : p)));
	}, [quantity, baseAutoTopping]);

	const meetsMinToppings = () => {
		const min = menuItem.minToppingsRequired ?? 0;
		return selectedToppings.length >= min;
	};
	const disableForMinTop = !meetsMinToppings();

	function getToppingStock(topping: Topping): number {
		const base = toNumericStock(topping.stock);
		if (!isMounted) return base;
		if (isEditMode) return base;
		if (!Number.isFinite(base)) return Infinity;

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
		return Math.max(0, (base as number) - used);
	}

	const totalInCart = state.items.filter((item) => item.menuItem.id === menuItem.id).reduce((sum, item) => sum + item.quantity, 0);
	const totalInCartExcludingEdit = isEditMode && editingItem ? totalInCart - editingItem.quantity : totalInCart;
	const baseMenuStock = toNumericStock(menuItem.stock);
	const maxQuantity = Number.isFinite(baseMenuStock) ? Math.max(0, (baseMenuStock as number) - totalInCartExcludingEdit) : Infinity;

	const selectedBase = baseAutoTopping ? selectedToppings.find((t) => t.id === baseAutoTopping.id) || null : null;
	const basePricePerUnit = selectedBase ? selectedBase.price : menuItem.price;
	const otherSelectedToppings = selectedToppings.filter((t) => !selectedBase || t.id !== selectedBase.id);
	const otherToppingsSubtotal = otherSelectedToppings.reduce((sum, t) => sum + t.price * t.quantity, 0);
	const uiTotalPrice = basePricePerUnit * quantity + otherToppingsSubtotal;
	const calculateTotalPrice = () => uiTotalPrice;

	const handleAddToCart = () => {
		if (quantity > maxQuantity) {
			toast.error(`Stok tidak cukup. Sisa stok hanya ${maxQuantity}`, { duration: 1500, position: 'top-center' });
			return;
		}
		if (!meetsMinToppings()) {
			const min = menuItem.minToppingsRequired ?? 0;
			toast.error(`Pilih minimal ${min} topping untuk menu ini.`, { duration: 1500, position: 'top-center' });
			return;
		}

		const payloadToppings = selectedToppings.map((t) => (baseAutoTopping && t.id === baseAutoTopping.id ? { ...t, quantity } : t));

		dispatch({
			type: 'ADD_ITEM',
			payload: { menuItem, selectedToppings: payloadToppings, quantity },
		});

		toast.success(`${quantity}x ${menuItem.name} ditambahkan ke keranjang!`, { duration: 1500, position: 'top-center' });
		setQuantity(1);
		setSelectedToppings([]);
	};

	const handleEditOrder = () => {
		const targetId = itemId ?? editItem?.id;
		if (!targetId) return;

		const payloadToppings = selectedToppings.map((t) => (baseAutoTopping && t.id === baseAutoTopping.id ? { ...t, quantity } : t));

		dispatch({
			type: 'EDIT_ITEM',
			payload: { id: targetId, menuItem, selectedToppings: payloadToppings, quantity },
		});

		const duration = 1000;
		toast.success(`Pesananan ${menuItem.name} berhasil diubah!`, { duration, position: 'top-center' });
		setTimeout(() => router.push('/cart'), duration + 500);
	};

	return (
		<section className="py-8 lg:py-12">
			<div className="container mx-auto px-4">
				<div className="mb-8">
					<Link href="/menu">
						<Button variant="ghost" className="mb-4" aria-label="Kembali ke halaman menu">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Kembali ke Menu
						</Button>
					</Link>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					<div className="space-y-4">
						<div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
							<Image src={menuItem.image || '/placeholder.svg'} alt={menuItem.name} fill className={`object-cover ${!menuItem.stock || !isShopOpen ? 'grayscale' : ''}`} priority />
							<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

							<div className="absolute top-4 right-4">
								<Button
									variant="ghost"
									size="icon"
									aria-label={isFavorite(menuItem.id) ? `Hapus ${menuItem.name} dari favorit` : `Tambah ${menuItem.name} ke favorit`}
									className={`h-10 w-10 rounded-full backdrop-blur-sm transition-all duration-300 ${
										!isMounted ? 'bg-white/20 text-white hover:bg-white/30' : isFavorite(menuItem.id) ? 'bg-red-500/90 text-white hover:bg-red-600/90' : 'bg-white/20 text-white hover:bg-white/30'
									}`}
									onClick={() => {
										if (!isMounted) return;
										const wasInFavorites = isFavorite(menuItem.id);
										toggleFavorite(menuItem);
										toast.dismiss('favorite-toast');
										if (!wasInFavorites) {
											toast(`${menuItem.name} telah ditambahkan ke favorit`, { id: 'favorite-toast', duration: 1000, position: 'top-center', icon: '💖' });
										} else {
											toast(`${menuItem.name} telah dihapus dari favorit`, { id: 'favorite-toast', duration: 1000, position: 'top-center', icon: '💔' });
										}
									}}
								>
									<Heart className={`h-5 w-5 transition-all duration-300 ${isMounted && isFavorite(menuItem.id) ? 'fill-current' : ''}`} />
								</Button>
							</div>

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

							<div className="absolute bottom-4 right-4">
								{!isShopOpen && (
									<Badge variant="destructive">
										<Clock className="h-3 w-3 mr-1" />
										Tutup
									</Badge>
								)}
								{isShopOpen && Number(menuItem.stock) > 0 && <Badge className="bg-green-500 text-white">Tersedia</Badge>}
								{isShopOpen && !menuItem.stock && (
									<Badge variant="destructive">
										<CircleSlash2 className="h-3 w-3 mr-1" />
										Habis
									</Badge>
								)}
							</div>
						</div>
					</div>

					<div className="space-y-6">
						<div className="space-y-2">
							<h1 className="text-3xl lg:text-4xl font-bold">{menuItem.name}</h1>

							{typeof menuItem.rating === 'number' && typeof menuItem.ratingCount === 'number' && (
								<div className="flex items-center gap-3">
									<Stars value={menuItem.rating} />
									<span className="text-sm text-muted-foreground">
										{menuItem.rating.toFixed(1)} • {menuItem.ratingCount} Review{menuItem.ratingCount !== 1 ? 's' : ''}
									</span>
								</div>
							)}

							<p className="text-lg text-muted-foreground">{menuItem.description}</p>
							<div className="text-2xl font-bold text-primary">{menuItem.price === 0 ? (baseAutoTopping ? formatCurrency(baseAutoTopping.price) : 'Gratis') : formatCurrency(menuItem.price)}</div>
						</div>

						{menuItem.toppings && menuItem.toppings.length > 0 && (
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Pilih Toppings (Opsional)</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{menuItem.toppings.map((topping) => {
										const selected = selectedToppings.find((t) => t.id === topping.id);
										const currentStock = getToppingStock(topping);
										const isFree = topping.price === 0;
										const isOutOfStock = Number.isFinite(currentStock) ? (currentStock as number) <= 0 : false;
										const lockQty = !!topping.main && !!topping.autoSelect;

										return (
											<div key={topping.id} className="flex items-center justify-between">
												<div className="flex items-center space-x-3">
													<Checkbox
														id={topping.id}
														checked={!!selected}
														disabled={isOutOfStock}
														onCheckedChange={(checked) => {
															const okToSelect = checked === true && (!Number.isFinite(currentStock) || (currentStock as number) > 0);
															if (okToSelect) {
																setSelectedToppings((prev) => {
																	if (prev.some((p) => p.id === topping.id)) return prev;
																	const qtyForThis = baseAutoTopping && topping.id === baseAutoTopping.id ? quantity : 1;
																	return [...prev, { ...topping, quantity: qtyForThis }];
																});
															} else if (checked === false) {
																setSelectedToppings((prev) => prev.filter((t) => t.id !== topping.id));
															} else {
																toast.error('Topping habis', { duration: 1200, position: 'top-center' });
															}
														}}
													/>

													<label htmlFor={topping.id} className={`text-sm font-medium cursor-pointer ${isOutOfStock ? 'text-destructive' : ''}`}>
														{topping.name}
														{topping.main && <span className="ml-2 text-xs text-primary">(Utama)</span>}
														{isOutOfStock && ' (Habis)'}
													</label>

													{!!selected && !isFree && !lockQty && (
														<div className="flex items-center space-x-1 ml-2">
															<Button
																variant="outline"
																size="icon"
																aria-label={`Kurangi jumlah topping ${topping.name}`}
																onClick={() => setSelectedToppings((prev) => prev.map((t) => (t.id === topping.id ? { ...t, quantity: Math.max(1, (t.quantity ?? 1) - 1) } : t)))}
																disabled={(selected.quantity ?? 1) <= 1}
															>
																<Minus className="h-3 w-3" />
															</Button>

															<span className="text-sm font-semibold w-6 text-center" aria-label={`Jumlah topping ${topping.name}: ${selected.quantity ?? 1}`}>
																{selected.quantity ?? 1}
															</span>

															<Button
																variant="outline"
																size="icon"
																aria-label={`Tambah jumlah topping ${topping.name}`}
																onClick={() => {
																	const maxStock = currentStock;
																	const next = (selected.quantity ?? 1) + 1;
																	setSelectedToppings((prev) =>
																		prev.map((t) =>
																			t.id === topping.id
																				? {
																						...t,
																						quantity: Math.min(next, Number.isFinite(maxStock) ? (maxStock as number) : next),
																				  }
																				: t
																		)
																	);
																}}
																disabled={Number.isFinite(currentStock) ? (selected.quantity ?? 1) >= (currentStock as number) : false}
															>
																<Plus className="h-3 w-3" />
															</Button>

															<span className="text-xs text-muted-foreground ml-2">Stok: {Number.isFinite(currentStock) ? (currentStock as number) - (selected.quantity ?? 1) : 'Banyak'}</span>
														</div>
													)}
												</div>

												<span className="text-sm text-muted-foreground">{isFree ? 'Gratis' : formatCurrency(topping.price)}</span>
											</div>
										);
									})}
								</CardContent>
							</Card>
						)}

						{menuItem.price > 0 || selectedBase ? (
							<Card>
								<CardContent className="p-4">
									<div className="flex items-center justify-between">
										<span className="font-medium">Jumlah</span>
										<div className="flex items-center space-x-3">
											<Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={!isMounted || quantity <= 1} aria-label="Kurangi jumlah pesanan">
												<Minus className="h-4 w-4" />
											</Button>
											<span className="text-lg font-semibold w-8 text-center" aria-label={`Jumlah pesanan: ${quantity}`}>
												{quantity}
											</span>
											<Button variant="outline" size="icon" onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))} disabled={!isMounted || quantity >= maxQuantity} aria-label="Tambah jumlah pesanan">
												<Plus className="h-4 w-4" />
											</Button>
										</div>
									</div>
									{isMounted && (
										<div className="mt-2 text-sm text-muted-foreground">
											Sisa stok: <span className="font-bold text-primary">{Number.isFinite(maxQuantity) ? Math.max(0, (maxQuantity as number) - quantity) : 'Banyak'}</span>
										</div>
									)}
								</CardContent>
							</Card>
						) : null}

						<Card className="bg-muted/50">
							<CardContent className="p-4 space-y-3">
								<div className="flex justify-between text-sm">
									<span>Harga dasar ({quantity}x)</span>
									<span>{basePricePerUnit === 0 ? 'Gratis' : formatCurrency(basePricePerUnit * quantity)}</span>
								</div>
								{otherSelectedToppings.length > 0 && (
									<>
										<Separator />
										<div className="space-y-1">
											<div className="text-sm font-medium">Toppings:</div>
											{otherSelectedToppings.map((topping) => (
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

						{isEditMode ? (
							<Button onClick={handleEditOrder} size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white" disabled={!isMounted || !menuItem.stock || disableForMinTop || !isShopOpen} aria-label={`Ubah pesanan ${menuItem.name}`}>
								<ShoppingCart className="h-5 w-5 mr-2" />
								Ubah Pesanan
							</Button>
						) : (
							<Button onClick={handleAddToCart} size="lg" className="w-full" disabled={!isMounted || !menuItem.stock || maxQuantity <= 0 || disableForMinTop || !isShopOpen} aria-label={`Tambah ${quantity}x ${menuItem.name} ke keranjang`}>
								<ShoppingCart className="h-5 w-5 mr-2" />
								Tambah ke Keranjang
							</Button>
						)}

						{!meetsMinToppings() && <p className="text-xs text-destructive text-center">Pilih minimal {menuItem.minToppingsRequired ?? 0} topping untuk melanjutkan.</p>}
						{maxQuantity <= 0 && <p className="text-sm text-destructive text-center">Stok habis, tidak bisa menambah ke keranjang.</p>}
					</div>
				</div>
			</div>
			<Toaster />
		</section>
	);
}
