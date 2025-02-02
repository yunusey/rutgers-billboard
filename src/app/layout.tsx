import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Providers } from "./providers";
import "./globals.css";

const jetbrains = JetBrains_Mono({
	variable: "--font-jetbrains",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Rutgers Billboard",
	description: "Finding the best sections for your classes made easy...",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${jetbrains.className} antialiased`}
			>
				<UserProvider>
					<Providers>
						{children}
					</Providers>
				</UserProvider>
			</body>
		</html>
	);
}
