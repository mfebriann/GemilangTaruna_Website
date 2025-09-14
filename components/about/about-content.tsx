import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Users, Award, Heart, Utensils } from 'lucide-react';
import { aboutUs } from '@/lib/utils';

export function AboutContent() {
	const values = [
		{
			icon: Heart,
			title: 'Cinta pada Jajanan',
			description: 'Setiap menu disiapkan dengan perhatian untuk menjaga rasa yang lezat dan sederhana.',
		},
		{
			icon: Users,
			title: 'Pelayanan Terbaik',
			description: 'Kepuasan pelanggan adalah prioritas utama dalam setiap interaksi.',
		},
		{
			icon: Award,
			title: 'Bahan Berkualitas',
			description: 'Menggunakan bahan segar dan terjangkau untuk menciptakan rasa yang konsisten setiap hari.',
		},
	];

	return (
		<section className="py-16 lg:py-24">
			<div className="container mx-auto px-4">
				{/* Main About Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
					{/* Left Content - About Text in Indonesian */}
					<div className="space-y-6">
						<div className="space-y-4">
							<Badge variant="secondary" className="mb-2">
								Cerita Kami
							</Badge>
							<h2 className="text-3xl lg:text-4xl font-bold text-balance">
								Warun Jajan Sederhana, <span className="text-primary">Penuh Rasa</span>
							</h2>
						</div>

						<div className="space-y-4 text-muted-foreground leading-relaxed">
							<p>
								{aboutUs.name} berdiri sejak tahun {aboutUs.since} dengan tujuan sederhana: menghadirkan jajanan warung yang enak, terjangkau, dan mudah dinikmati setiap hari. Usaha ini dimulai dari dapur rumah dengan resep-resep rumahan
								yang sederhana namun penuh rasa.
							</p>

							<p>
								Kami menyajikan beragam pilihan jajanan yang dibuat fresh setiap hari. Dari Seblak pedas yang menggugah selera, Ayam Geprek gurih yang jadi favorit, hingga Pisang Keju manis yang pas untuk camilan. Minuman sederhana seperti
								Kopi, Pop Ice, dan Es Teh manis pun siap menemani santapan Anda.
							</p>

							<p>
								{aboutUs.name} adalah warung jajanan sederhana, sehingga tidak menyediakan tempat makan di lokasi. Meski begitu, kami berkomitmen memberikan pelayanan yang ramah, cepat, dan praktis agar pelanggan bisa membawa pulang jajanan
								favorit dan menikmatinya di rumah, kantor, atau di mana saja.
							</p>

							<p>Terima kasih telah mempercayai kami sebagai pilihan jajanan sederhana Anda. Mari terus dukung dan nikmati jajanan warung yang merakyat, penuh rasa, dan selalu fresh setiap hari.</p>
						</div>

						{/* Key Info */}
						<div className="grid grid-cols-2 gap-4 pt-4">
							<div className="flex items-center space-x-2 text-sm">
								<Clock className="h-4 w-4 text-primary" />
								<span>Buka {aboutUs.openingHours}</span>
							</div>
							<div className="flex items-center space-x-2 text-sm">
								<MapPin className="h-4 w-4 text-primary" />
								<span>Jakarta Pusat</span>
							</div>
							<div className="flex items-center space-x-2 text-sm">
								<Utensils className="h-4 w-4 text-primary" />
								<span>Jajanan & Minuman Lezat</span>
							</div>
							<div className="flex items-center space-x-2 text-sm">
								<Award className="h-4 w-4 text-primary" />
								<span>Harga Terjangkau</span>
							</div>
						</div>
					</div>

					{/* Right Content - Image */}
					<div className="relative">
						<div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
							<Image src="/suasana-warung.webp" alt={`Suasana ${aboutUs.name}`} fill className="object-cover" />
							<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

							{/* Floating Elements */}
							<div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
								<div className="text-center">
									<div className="text-2xl font-bold text-primary">2+</div>
									<div className="text-xs text-muted-foreground">Tahun Berpengalaman</div>
								</div>
							</div>

							<div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
								<div className="text-center">
									<div className="text-2xl font-bold text-primary">100+</div>
									<div className="text-xs text-muted-foreground">Pelanggan Setia</div>
								</div>
							</div>
						</div>

						{/* Decorative Elements */}
						<div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary/20 rounded-full blur-xl" />
						<div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-xl" />
					</div>
				</div>

				{/* Values Section */}
				<div className="space-y-8">
					<div className="text-center space-y-4">
						<h3 className="text-2xl lg:text-3xl font-bold">Nilai-Nilai Kami</h3>
						<p className="text-muted-foreground text-pretty max-w-2xl mx-auto">Prinsip-prinsip yang menjadi fondasi dalam setiap pelayanan dan hidangan yang kami sajikan</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{values.map((value, index) => {
							const Icon = value.icon;
							return (
								<Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
									<CardContent className="p-6 space-y-4">
										<div className="flex justify-center">
											<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
												<Icon className="h-6 w-6 text-primary" />
											</div>
										</div>
										<div className="space-y-2">
											<h4 className="text-lg font-semibold">{value.title}</h4>
											<p className="text-sm text-muted-foreground text-pretty">{value.description}</p>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
