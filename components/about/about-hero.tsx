import { aboutUs } from '@/lib/utils';
import { Heart, Users, Award } from 'lucide-react';

export function AboutHero() {
	return (
		<section className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-16 lg:py-20">
			<div className="container mx-auto px-4">
				<div className="text-center space-y-6 max-w-3xl mx-auto">
					<div className="flex justify-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
							<Heart className="h-8 w-8 text-primary" />
						</div>
					</div>

					<h1 className="text-4xl lg:text-5xl font-bold text-balance">
						Tentang <span className="text-primary">{aboutUs.name}</span>
					</h1>

					<p className="text-lg text-muted-foreground text-pretty">Menemani hari Anda dengan jajanan dan minuman favorit yang mudah dinikmati kapan saja.</p>

					{/* Quick Stats */}
					<div className="flex flex-wrap justify-center gap-8 pt-4">
						<div className="flex items-center space-x-2 text-sm">
							<Award className="h-4 w-4 text-yellow-500" />
							<span className="font-medium">Sejak {aboutUs.since}</span>
						</div>
						<div className="flex items-center space-x-2 text-sm">
							<Users className="h-4 w-4 text-primary" />
							<span className="font-medium">100+ Pelanggan Puas</span>
						</div>
						<div className="flex items-center space-x-2 text-sm">
							<Heart className="h-4 w-4 text-red-500" />
							<span className="font-medium">Jajanan Terbaik</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
