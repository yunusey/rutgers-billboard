"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
			<Dashboard />
		</div>
	);
}

function NavBar({ user }: { user: UserProfile | undefined }) {
	return (
		<Navbar fluid className="w-full items-center justify-center bg-[#1e1e2e] border-b-4 border-[#89b4fa]">
			<div className="float-left w-fit">
				<Navbar.Brand as={Link} href="/" className={`${alegreya.className} text-2xl text-[#89b4fa]`}>
					Rutgers Billboard
				</Navbar.Brand>
			</div>
			<div className="float-right w-fit">
				{user && (
					<Dropdown
						arrowIcon={false}
						inline
						label={
							<Avatar className="h-10 w-10" img={user?.picture ? user.picture : ""} rounded />
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

type SectionRequest = {
	//_id: ObjectId
	class: String
	section: {
		current: String
		wants: String
	}
	time: String
}

const Dashboard = () => {
	const [classes, setClasses] = useState<SectionRequest[]>([])
	useEffect(() => {
		fetch("/api/db")
			.then((res) => res.json())
			.then((data) => setClasses(data))
	}, [])
	return (
		<div className="flex w-full m-4 items-center justify-center">
			<table className="w-3/4 border-collapse border border-[#89b4fa] shadow-lg">
				<thead className="bg-[#fab387] text-[#1e1e2e]">
					<tr>
						<th className="border p-2">Class</th>
						<th className="border p-2">Has</th>
						<th className="border p-2">Wants</th>
						<th className="border p-2">Time</th>
					</tr>
				</thead>
				<tbody>
					{classes.map((classItem: any) => {
						const time = new Date(classItem.time * 1000).toLocaleString();
						return (
							<tr key={classItem._id} className="even:bg-gray-100 hover:bg-gray-200 transition">
								<td className="border p-2">{classItem.class}</td>
								<td className="border p-2">{classItem.section.current}</td>
								<td className="border p-2">{classItem.section.wants.join(';')}</td>
								<td className="border p-2">{time}</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	);
}
