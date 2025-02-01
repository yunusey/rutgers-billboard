"use client";

import { useRouter } from "next/navigation";
import Link from 'next/link';
import { useUser, UserProfile } from "@auth0/nextjs-auth0/client";
import { Alegreya } from "next/font/google";
import { Dropdown, Avatar, Navbar } from "flowbite-react";

const alegreya_italic = Alegreya({
	subsets: ["latin"],
	weight: "400",
	style: "italic",
});
const alegreya = Alegreya({
	subsets: ["latin"],
	weight: "400",
	style: "normal",
})

export default function Home() {
	const { isLoading, user } = useUser();
	const router = useRouter();

	if (!isLoading && !user) {
		router.push("/");
	}

	return (
		<div className="items-center justify-center">
			<NavBar user={user} />
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
				<Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" href="api/auth/logout">
					Logout
				</Link>
			</div>
		</div>
	);
}

function NavBar({ user }: { user: UserProfile | undefined }) {
	return (
		<Navbar fluid className="bg-[#1e1e2e] border-b-4 border-[#89b4fa]">
			<Navbar.Brand as={Link} href="/" className={`${alegreya.className} text-2xl text-[#89b4fa]`}>
				Rutgers Billboard
			</Navbar.Brand>
			<div className="float-right">
				{user && (
					<Dropdown
						arrowIcon={false}
						inline
						label={
							<Avatar img={user.picture} rounded />
						}
						className="bg-[#1e1e2e] border-r-8 border-2 border-[#89b4fa]"
					>
						<Dropdown.Header>
							<span className="block text-sm">{user?.name}</span>
							<span className="block truncate text-sm font-medium">{user?.email}</span>
						</Dropdown.Header>
						<Dropdown.Item>Dashboard</Dropdown.Item>
						<Dropdown.Item>Settings</Dropdown.Item>
						<Dropdown.Item>Earnings</Dropdown.Item>
						<Dropdown.Divider />
						<Dropdown.Item>Sign out</Dropdown.Item>
					</Dropdown>
				)}
			</div>
		</Navbar>
	);
}
