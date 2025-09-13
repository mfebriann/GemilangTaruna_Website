'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Clock, MapPin } from 'lucide-react';
import { aboutUs, handleWhatsAppOrder } from '@/lib/utils';

export function HeroSection() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50 py-16 lg:py-24">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left Content */}
					<div className="space-y-8">
						<div className="space-y-4">
							<div className="flex items-center space-x-2 text-sm text-primary font-medium">
								<Star className="h-4 w-4 fill-current" />
								<span>Warung Jajanan Sejak {aboutUs.since}</span>
							</div>
							<h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
								Dari Warung <span className="text-primary">Sederhana.</span> Untuk Semua
							</h1>
							<p className="text-lg text-muted-foreground text-pretty max-w-md">Nikmati berbagai makanan dan minuman lezat khas warung kami. Dari Seblak pedas hingga Es Teh manis, semua tersedia untuk Anda.</p>
						</div>

						{/* Quick Info */}
						<div className="flex flex-wrap gap-6 text-sm">
							<div className="flex items-center space-x-2">
								<Clock className="h-4 w-4 text-primary shrink-0" />
								<span>Buka Senin - Sabtu: {aboutUs.openingHours}</span>
							</div>
							<div className="flex items-center space-x-2">
								<MapPin className="h-4 w-4 text-primary shrink-0" />
								<span>{aboutUs.location}</span>
							</div>
						</div>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-4">
							<Link href="/menu">
								<Button size="lg" className="w-full sm:w-auto">
									Lihat Menu
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</Link>
							<Button variant="outline" size="lg" onClick={handleWhatsAppOrder} className="w-full sm:w-auto bg-transparent">
								Pesan via WhatsApp
							</Button>
						</div>
					</div>

					{/* Right Content - Hero Image */}
					<div className="relative">
						<div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
							<Image src="/indonesian-seblak-spicy-noodles-with-vegetables.jpg" alt="Seblak - Makanan Khas Indonesia" fill className="object-cover" priority />
							<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

							{/* Floating Badge */}
							<div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
								<div className="flex items-center space-x-2">
									<Star className="h-4 w-4 text-yellow-500 fill-current" />
									<span className="text-sm font-medium">Best Seller</span>
								</div>
							</div>
						</div>

						{/* Decorative Elements */}
						<div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary/20 rounded-full blur-xl" />
						<div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-xl" />
					</div>
				</div>
			</div>
		</section>
	);
}
