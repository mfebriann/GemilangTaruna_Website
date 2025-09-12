'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, MessageCircle, Navigation } from 'lucide-react';
import { aboutUs, formatWhatsappNumber, handleWhatsAppOrder } from '@/lib/utils';

export function ContactInfo() {
	const handleDirectionsClick = () => {
		const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Warung Gemilang Taruna Kemayoran')}`;
		window.open(mapsUrl, '_blank');
	};

	return (
		<section className="py-16 lg:py-24">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Left Content - Contact Information */}
					<div className="space-y-8">
						<div className="space-y-4">
							<Badge variant="secondary" className="mb-2">
								Informasi Kontak
							</Badge>
							<h2 className="text-3xl lg:text-4xl font-bold text-balance">
								Mari <span className="text-primary">Terhubung</span> dengan Kami
							</h2>
							<p className="text-lg text-muted-foreground text-pretty">Kami selalu siap membantu Anda. Hubungi kami melalui berbagai cara yang tersedia atau kunjungi langsung warung kami.</p>
						</div>

						{/* Contact Cards */}
						<div className="space-y-4">
							{/* WhatsApp */}
							<Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
								<CardContent className="p-6">
									<div className="flex items-start space-x-4">
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
											<MessageCircle className="h-6 w-6 text-green-500" />
										</div>
										<div className="flex-1 space-y-3">
											<div>
												<h3 className="font-semibold text-lg">WhatsApp</h3>
												<p className="text-muted-foreground">Cara tercepat untuk menghubungi kami</p>
											</div>
											<div className="space-y-1">
												<p className="font-medium">{formatWhatsappNumber()}</p>
											</div>
											<Button onClick={handleWhatsAppOrder} className="bg-green-500 hover:bg-green-600">
												<MessageCircle className="h-4 w-4 mr-2" />
												Chat Sekarang
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Location */}
							<Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
								<CardContent className="p-6">
									<div className="flex items-start space-x-4">
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
											<MapPin className="h-6 w-6 text-primary" />
										</div>
										<div className="flex-1 space-y-3">
											<div>
												<h3 className="font-semibold text-lg">Lokasi Warung</h3>
												<p className="text-muted-foreground">Kunjungi kami langsung</p>
											</div>
											<div className="space-y-1">
												<p className="font-medium">{aboutUs.location}</p>
											</div>
											<Button variant="outline" onClick={handleDirectionsClick}>
												<Navigation className="h-4 w-4 mr-2" />
												Lihat Arah
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>

							{/* Operating Hours */}
							<Card className="border-l-4 border-l-secondary hover:shadow-lg transition-shadow">
								<CardContent className="p-6">
									<div className="flex items-start space-x-4">
										<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
											<Clock className="h-6 w-6 text-secondary" />
										</div>
										<div className="flex-1 space-y-3">
											<div>
												<h3 className="font-semibold text-lg">Jam Operasional</h3>
											</div>
											<div className="space-y-2">{aboutUs.openingHours}</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					{/* Right Content - Google Maps */}
					<div className="space-y-6">
						<div className="space-y-4">
							<h3 className="text-2xl font-bold">Temukan Kami di Peta</h3>
							<p className="text-muted-foreground">{aboutUs.name} terletak di lokasi yang strategis dan mudah dijangkau dengan berbagai transportasi.</p>
						</div>

						<div className="space-y-4">
							<div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted shadow-lg">
								<iframe
									src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15866.968287692815!2d106.85323844637077!3d-6.1652858523013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f56d6c8921b7%3A0x151971d75c92e4e8!2sWarung%20Gemilang%20Taruna%20Kemayoran!5e0!3m2!1sen!2sid!4v1757668851532!5m2!1sen!2sid"
									width="100%"
									height="100%"
									style={{ border: 0 }}
									allowFullScreen
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
									title={`Lokasi ${aboutUs.name}`}
								/>
							</div>

							<p className="text-sm text-muted-foreground text-center">Klik pada peta untuk membuka di Google Maps dan mendapatkan petunjuk arah yang lebih detail.</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
