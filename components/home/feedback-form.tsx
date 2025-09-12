'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageCircle, Send } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { aboutUs } from '@/lib/utils';

export function FeedbackForm() {
	const [name, setName] = useState('');
	const [suggestion, setSuggestion] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim() || !suggestion.trim()) {
			toast.error('Mohon isi semua field yang diperlukan', {
				duration: 2000,
				position: 'top-center',
			});
			return;
		}

		setIsSubmitting(true);

		try {
			// Send to WhatsApp
			const message = `*Saran/Kritik dari Website*\n\nNama: ${name}\nSaran/Kritik: ${suggestion}\n\nTerima kasih atas feedback Anda!`;
			const whatsappUrl = `https://wa.me/${aboutUs.whatsapp}?text=${encodeURIComponent(message)}`;

			window.open(whatsappUrl, '_blank');

			// Reset form
			setName('');
			setSuggestion('');

			toast.success('Terima kasih atas feedback Anda!', {
				duration: 2000,
				position: 'top-center',
				icon: '👋',
			});
		} catch (error) {
			toast.error('Maaf, terjadi kesalahan. Silakan coba lagi.', {
				duration: 2000,
				position: 'top-center',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="py-16 lg:py-24">
			<div className="container mx-auto px-4">
				<div className="max-w-2xl mx-auto">
					<Card className="shadow-lg">
						<CardHeader className="text-center space-y-4">
							<div className="flex justify-center">
								<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
									<MessageCircle className="h-6 w-6 text-primary" />
								</div>
							</div>
							<CardTitle className="text-2xl lg:text-3xl">
								Saran & <span className="text-primary">Kritik</span>
							</CardTitle>
							<p className="text-muted-foreground text-pretty">Bantu kami meningkatkan pelayanan dengan memberikan saran atau kritik yang membangun. Feedback Anda sangat berharga bagi kami.</p>
						</CardHeader>

						<CardContent className="space-y-6">
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="name">Nama Lengkap</Label>
									<Input id="name" type="text" placeholder="Masukkan nama Anda" value={name} onChange={(e) => setName(e.target.value)} required />
								</div>

								<div className="space-y-2">
									<Label htmlFor="suggestion">Saran/Kritik</Label>
									<Textarea id="suggestion" placeholder="Bagikan saran atau kritik Anda untuk membantu kami berkembang..." value={suggestion} onChange={(e) => setSuggestion(e.target.value)} rows={5} required />
								</div>

								<Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
									{isSubmitting ? (
										'Mengirim...'
									) : (
										<>
											<Send className="h-4 w-4 mr-2" />
											Kirim via WhatsApp
										</>
									)}
								</Button>
							</form>

							<div className="text-center text-sm text-muted-foreground">Saran Anda akan dikirim langsung ke WhatsApp kami untuk respon yang lebih cepat.</div>
						</CardContent>
					</Card>
				</div>
			</div>
			<Toaster />
		</section>
	);
}
