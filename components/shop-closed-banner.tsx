'use client';

import { useState } from 'react';
import { X, CircleAlert } from 'lucide-react';
import { useShop } from '@/contexts/shop-context';
import { aboutUs } from '@/lib/utils';
import clsx from 'clsx';

export default function ShopClosedBanner({ className }: { className?: string }) {
	const { state } = useShop();
	const [hidden, setHidden] = useState(false);

	if (state.isOpenEffective || hidden) return null;

	return (
		<div className={clsx('relative isolate w-full', className)}>
			<div
				className="
    border border-black/5
    px-4 sm:px-6 py-3 sm:py-4
    shadow-md
 bg-gradient-to-r from-green-100 via-teal-100 to-sky-100
    backdrop-blur animate-hue

  "
			>
				<div className="flex items-center gap-3 sm:gap-4">
					<div className="mt-0.5 shrink-0 rounded-full bg-white/40 p-2">
						<CircleAlert className="h-5 w-5 text-emerald-700" />
					</div>

					<div className="min-w-0 flex-1">
						<div className="flex items-center gap-2">
							<p className="text-sm sm:text-base font-semibold text-emerald-900">{aboutUs.name} saat ini tutup</p>
							<span className="hidden sm:inline text-xs text-muted-foreground">•</span>
							<p className="hidden sm:inline text-sm text-muted-foreground">Buka Senin - Sabtu: {aboutUs.openingHours}</p>
						</div>
					</div>

					<button aria-label="Tutup banner" className="mt-0.5 rounded-md p-1 text-black/60 hover:bg-black/5 hover:text-black" onClick={() => setHidden(true)}>
						<X className="h-4 w-4" />
					</button>
				</div>
			</div>

			<style jsx>
				{`
					@keyframes hue {
						0% {
							filter: hue-rotate(0deg);
						}
						50% {
							filter: hue-rotate(180deg);
						}
						100% {
							filter: hue-rotate(360deg);
						}
					}

					.animate-hue {
						animation: hue 15s linear infinite;
					}
				`}
			</style>
		</div>
	);
}
