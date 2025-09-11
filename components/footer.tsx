import Link from 'next/link';
import { MapPin, Phone, Clock, Utensils } from 'lucide-react';
import { aboutUs, formatWhatsappNumber } from '@/lib/utils';

export function Footer() {
	return (
		<footer className="bg-card border-t">
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Logo & Description */}
					<div className="space-y-4">
						<Link href="/" className="flex items-center space-x-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
								<Utensils className="h-5 w-5" />
							</div>
							<span className="text-xl font-bold text-primary">{aboutUs.name}</span>
						</Link>
						<p className="text-sm text-muted-foreground">Menyajikan makanan dan minuman lezat untuk dinikmati setiap hari.</p>
					</div>

					{/* Quick Links */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Menu Cepat</h3>
						<ul className="space-y-2 text-sm">
							<li>
								<Link href="/" className="text-muted-foreground hover:text-primary">
									Home
								</Link>
							</li>
							<li>
								<Link href="/menu" className="text-muted-foreground hover:text-primary">
									Menu
								</Link>
							</li>
							<li>
								<Link href="/about" className="text-muted-foreground hover:text-primary">
									About
								</Link>
							</li>
							<li>
								<Link href="/contact" className="text-muted-foreground hover:text-primary">
									Contact
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Kontak</h3>
						<div className="space-y-2 text-sm">
							<div className="flex space-x-2">
								<Phone className="h-4 w-4 mt-1 text-primary shrink-0" />
								<span className="text-muted-foreground">{formatWhatsappNumber()}</span>
							</div>
							<div className="flex space-x-2">
								<MapPin className="h-4 w-4 mt-1 text-primary shrink-0" />
								<span className="text-muted-foreground">{aboutUs.location}</span>
							</div>
						</div>
					</div>

					{/* Operating Hours */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Jam Buka</h3>
						<div className="space-y-2 text-sm">
							<div className="flex items-center space-x-2">
								<Clock className="h-4 w-4 text-primary" />
								<div className="text-muted-foreground">
									<div>Senin - Sabtu: {aboutUs.openingHours}</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
					<p>&copy; 2024 {aboutUs.name}. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
