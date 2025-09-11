'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils } from 'lucide-react';
import { aboutUs } from '@/lib/utils';

export function LoadingScreen() {
	const [isMounted, setIsMounted] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsMounted(true);
		// Add a minimum loading time of 2 seconds
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 2000);

		return () => clearTimeout(timer);
	}, []);

	// Don't render anything during SSR
	if (!isMounted) return null;

	return (
		<AnimatePresence mode="wait">
			{isLoading && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0, transition: { duration: 0.5 } }}
					className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-secondary/5"
				>
					<div className="text-center">
						<motion.div
							initial={{ scale: 0.5, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{
								duration: 0.5,
								ease: 'easeOut',
							}}
							className="flex flex-col items-center space-y-4"
						>
							{/* Logo Container with bounce animation */}
							<motion.div
								animate={{
									y: [0, -15, 0],
								}}
								transition={{
									duration: 1.5,
									repeat: Infinity,
									ease: 'easeInOut',
								}}
								className="relative"
							>
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
									<Utensils className="h-8 w-8" />
								</div>
								{/* Shadow effect */}
								<div className="absolute -bottom-4 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-black/10 blur-sm" />
							</motion.div>

							{/* Restaurant Name */}
							<motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl font-bold text-primary">
								{aboutUs.name}
							</motion.h1>

							{/* Loading text with ellipsis animation */}
							<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-sm text-muted-foreground">
								<span className="inline-flex items-center gap-1">
									Loading...
									<motion.span
										animate={{
											opacity: [0, 1, 0],
										}}
										transition={{
											duration: 1.5,
											repeat: Infinity,
											repeatType: 'loop',
										}}
									>
										...
									</motion.span>
								</span>
							</motion.div>

							{/* Optional loading progress bar */}
							<motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1 }} className="h-0.5 w-24 bg-primary/20 overflow-hidden rounded-full">
								<motion.div
									animate={{
										x: ['-100%', '100%'],
									}}
									transition={{
										duration: 1,
										repeat: Infinity,
										ease: 'linear',
									}}
									className="h-full w-1/2 bg-primary rounded-full"
								/>
							</motion.div>
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
