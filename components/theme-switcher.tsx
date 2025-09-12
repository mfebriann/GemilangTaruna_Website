'use client';

import * as React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = React.useState(false);

	// Ensure component is mounted to avoid hydration mismatch
	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div className="w-9 h-9" />; // Placeholder with same dimensions
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" className="w-9 h-9 relative">
					{theme === 'light' ? (
						<Sun className="h-5 w-5 rotate-0 scale-100 transition-transform" />
					) : theme === 'dark' ? (
						<Moon className="h-5 w-5 rotate-0 scale-100 transition-transform" />
					) : (
						<Monitor className="h-5 w-5 rotate-0 scale-100 transition-transform" />
					)}
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="z-50">
				<DropdownMenuItem onClick={() => setTheme('light')}>
					<Sun className="mr-2 h-4 w-4" />
					<span>Light</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('dark')}>
					<Moon className="mr-2 h-4 w-4" />
					<span>Dark</span>
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme('system')}>
					<Monitor className="mr-2 h-4 w-4" />
					<span>System</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
