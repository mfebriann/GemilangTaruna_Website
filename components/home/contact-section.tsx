'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { aboutUs, formatWhatsappNumber, handleWhatsAppOrder } from '@/lib/utils';
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react';

export function ContactSection() {
	return (
		<section className="py-16 lg:py-24 bg-card">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left Content - Contact Info */}
					<div className="space-y-8">
						<div className="space-y-4">
							<h2 className="text-3xl lg:text-4xl font-bold text-balance">
								Kunjungi <span className="text-primary">Warung</span> Kami
							</h2>
							<p className="text-lg text-muted-foreground text-pretty">Temukan kami di lokasi yang strategis dengan suasana yang nyaman untuk menikmati hidangan Indonesia autentik.</p>
						</div>

						{/* Contact Cards */}
						<div className="space-y-4">
							<Card className="border-l-4 border-l-primary">
								<CardContent className="p-4">
									<div className="flex items-start space-x-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
											<Phone className="h-5 w-5 text-primary" />
										</div>
										<div className="space-y-1">
											<h3 className="font-semibold">WhatsApp</h3>
											<p className="text-sm text-muted-foreground">{formatWhatsappNumber()}</p>
											<Button size="sm" onClick={handleWhatsAppOrder} className="mt-2 bg-green-500 hover:bg-green-600">
												<MessageCircle className="h-4 w-4 mr-2" />
												Chat Sekarang
											</Button>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="border-l-4 border-l-secondary">
								<CardContent className="p-4">
									<div className="flex items-start space-x-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
											<MapPin className="h-5 w-5 text-secondary" />
										</div>
										<div className="space-y-1">
											<h3 className="font-semibold">Lokasi</h3>
											<p className="text-sm text-muted-foreground">{aboutUs.location}</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="border-l-4 border-l-accent">
								<CardContent className="p-4">
									<div className="flex items-start space-x-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
											<Clock className="h-5 w-5 text-accent" />
										</div>
										<div className="space-y-1">
											<h3 className="font-semibold">Jam Buka</h3>
											<div className="text-sm text-muted-foreground space-y-1">
												<div>Senin - Jumat: {aboutUs.openingHours}</div>
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					{/* Right Content - Google Maps */}
					<div className="space-y-4">
						<div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.777137630999!2d106.85791830989471!3d-6.160595293800849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f56d6c8921b7%3A0x151971d75c92e4e8!2sWarung%20Gemilang%20Taruna%20Kemayoran!5e0!3m2!1sen!2sid!4v1757574907585!5m2!1sen!2sid"
								width="100%"
								height="100%"
								style={{ border: 0 }}
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								title={`Lokasi ${aboutUs.name}`}
							/>
						</div>
						<p className="text-sm text-muted-foreground text-center">Klik pada peta untuk membuka di Google Maps</p>
					</div>
				</div>
			</div>
		</section>
	);
}
