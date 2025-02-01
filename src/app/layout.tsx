import type { Metadata } from "next";
import { Alegreya } from "next/font/google";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import "./globals.css";

const alegreya = Alegreya({
	variable: "--font-alegreya",
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
				className={`${alegreya.className} antialiased`}
			>
				<UserProvider>
					{children}
				</UserProvider>
			</body>
		</html>
	);
}
