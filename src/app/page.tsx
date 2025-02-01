"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Alegreya } from "next/font/google";

const alegreya_italic = Alegreya({
	subsets: ["latin"],
	weight: "400",
	style: "italic",
});

export default function Home() {
	const { isLoading, user } = useUser();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && user) {
			router.push("/dashboard");
		}
	}, [user, isLoading]);

	return (
		<div className="items-center justify-center">
			<div className="header text-center">
				<div className="text-5xl">
					Rutgers Billboard
				</div>
				<div className={`text-2xl ${alegreya_italic.className}`}>
					Finding the best sections for your classes made easy...
				</div>
			</div>

			<div className="flex mt-10 items-center justify-center gap-4">
				<Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" href="api/auth/login">
					Login
				</Link>
				<Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" href="api/auth/signup">
					Sign Up
				</Link>
			</div>
		</div>
	);
}
