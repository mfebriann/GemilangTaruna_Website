'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

export function Toaster() {
	const { toasts, dismiss } = useToast();

	if (!toasts || toasts.length === 0) return null;

	return (
		<div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
			{toasts.map((toast) => (
				<div key={toast.id} className={`bg-white shadow-lg rounded-lg px-4 py-3 border flex items-start gap-3 min-w-[250px] max-w-xs ${toast.variant === 'destructive' ? 'border-red-500' : 'border-primary'}`}>
					<div className="flex-1">
						{toast.title && <div className="font-semibold mb-1">{toast.title}</div>}
						{toast.description && <div className="text-sm text-muted-foreground">{toast.description}</div>}
					</div>
					<button className="ml-2 text-muted-foreground hover:text-primary" onClick={() => dismiss(toast.id)} aria-label="Close">
						<X className="h-4 w-4" />
					</button>
				</div>
			))}
		</div>
	);
}
