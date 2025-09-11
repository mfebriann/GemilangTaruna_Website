'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from './button';
import React from 'react';
import { handleWhatsAppOrder } from '@/lib/utils';

const WhatsAppButton: React.FC<{ className?: string }> = ({ className }) => {
	return (
		<Button onClick={handleWhatsAppOrder} size="sm" className={`fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white flex sm:static ${className}`}>
			<MessageCircle className="h-4 w-4 mr-2" />
			<span>WhatsApp</span>
		</Button>
	);
};

export default WhatsAppButton;
