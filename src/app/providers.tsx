'use client'

import { HeroUIProvider } from '@heroui/react'
import { useRouter } from 'next/navigation'

declare module "@react-types/shared" {
	interface RouterConfig {
		routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
	}
}

export function Providers({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	return (
		<HeroUIProvider navigate={router.push}>
			<main className="text-foreground bg-background">
				{children}
			</main>
		</HeroUIProvider>
	)
}
