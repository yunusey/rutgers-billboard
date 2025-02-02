"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser, UserProfile } from "@auth0/nextjs-auth0/client";
import { JetBrains_Mono } from "next/font/google";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@heroui/dropdown";
import { Avatar } from '@heroui/avatar';
import { Table, TableRow, TableColumn, TableBody, TableHeader, TableCell } from '@heroui/table';
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Autocomplete, AutocompleteItem, AutocompleteSection } from "@heroui/autocomplete";
import { Popover, PopoverTrigger, PopoverContent } from '@heroui/popover'
import { Checkbox, CheckboxGroup } from '@heroui/checkbox'

const jetbrains = JetBrains_Mono({
	subsets: ["latin"],
	weight: "400",
	style: "normal",
})

export default function Home() {
	const { isLoading, user } = useUser();
	const [classInfo, setClassInfo] = useState<any[]>([])
	const [sectionInfo, setSectionInfo] = useState<any[]>([])
	const [chosenClass, setChosenClass] = useState<string | null>('')
	const [chosenSection, setChosenSection] = useState<string | null>('')
	const router = useRouter();

	useEffect(() => {
		fetch("/api/db/info/class")
			.then((res) => res.json())
			.then((data) => setClassInfo(data))
	}, [])

	useEffect(() => {
		if (chosenClass) {
			fetch(`/api/db/info/section?courseString=${chosenClass}`)
				.then((res) => res.json())
				.then((data) => setSectionInfo(data))
		}
	}, [chosenClass])

	return (
		<div className="w-full">
			<NavBar user={user} isLoading={isLoading} />
			<div className={`grid grid-cols-3 ${jetbrains.className}`}>
				<Autocomplete className="w-full h-full p-4" variant="bordered" label="Select a class" defaultItems={classInfo} onSelectionChange={(key) => setChosenClass(key as string)} isVirtualized={false}>
					{
						((item: { _id: string, name: string }) => {
							return (
								<AutocompleteItem key={item._id} textValue={item._id}>
									<div className={jetbrains.className}>
										<strong>{item.name}</strong> ({item._id})
									</div>
								</AutocompleteItem>
							)
						})
					}
				</Autocomplete>
				<Autocomplete className="w-full h-full p-4" variant="bordered" label="Select a section" onSelectionChange={(key) => setChosenSection(key as string)} defaultItems={sectionInfo}>
					{
						((item: { _id: string, name: string }) => {
							return (
								<AutocompleteItem key={item._id} textValue={item._id} className={jetbrains.className}>
									{item._id}
								</AutocompleteItem>
							)
						})
					}
				</Autocomplete>
				<Popover showArrow offset={10} placement="bottom">
					<div className="w-full p-4">
						<PopoverTrigger className="w-full p-4">
							<Button color="secondary" className="w-full h-full" >
								Add a new request
							</Button>
						</PopoverTrigger>
					</div>
					<NewRequestPopover user={user} />
				</Popover>
			</div>
			<Dashboard section={chosenSection!} />
		</div >
	);
}

function NavBar({ user, isLoading }: { user: UserProfile | undefined, isLoading: boolean }) {
	return (
		<Navbar className={`border-b-4 border-secondary bg-background w-full`}>
			<NavbarBrand>
				<Button variant="light" className="font-medium text-2xl" href="/">Rutgers Billboard</Button>
			</NavbarBrand>
			<NavbarContent className="hidden sm:flex gap-4" justify="center" />
			{user &&
				<NavbarContent className="hidden sm:flex gap-4 text-" justify="end">
					<Dropdown placement="bottom-end">
						<DropdownTrigger>
							<Button variant="light" className="flex gap-2">
								<div className="font-medium">
									{user?.nickname ?? user?.name ?? ""}
								</div>
								<Avatar
									isBordered
									showFallback
									className="transition-transform bg-transparent"
									name={user?.nickname ?? user?.name ?? ""}
									size="sm"
									src={user?.picture ?? ""}
								/>
							</Button>
						</DropdownTrigger>
						<DropdownMenu aria-label="Profile Actions">
							<DropdownItem key="profile">Profile</DropdownItem>
							<DropdownItem key="logout" color="danger" href="/api/auth/logout">Log Out</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</NavbarContent>
			}
			{!user && !isLoading &&
				<NavbarContent as="button" className="text-2xl hidden sm:flex gap-4" justify="end">
					<Dropdown placement="bottom-end">
						<DropdownTrigger>
							<div>
								Join Us!
							</div>
						</DropdownTrigger>
						<DropdownMenu aria-label="Profile Actions" className={jetbrains.className}>
							<DropdownItem key="login" href="/api/auth/login" color="primary">Log In</DropdownItem>
							<DropdownItem key="register" href="/api/auth/signup" color="primary">Register</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</NavbarContent>
			}
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

const Dashboard = ({ section }: { section: string }) => {
	const [sections, setSections] = useState<SectionRequest[]>([])
	useEffect(() => {
		fetch(`/api/db?section=${section ?? ""}`)
			.then((res) => res.json())
			.then((data) => setSections(data))
	}, [section])
	return (
		<Table isStriped isCompact aria-label="Dashboard Table" className={`${jetbrains.className} p-4`}>
			<TableHeader>
				<TableColumn>Class</TableColumn>
				<TableColumn>Has</TableColumn>
				<TableColumn>Wants</TableColumn>
				<TableColumn>Time</TableColumn>
				<TableColumn>Actions</TableColumn>
			</TableHeader>
			<TableBody emptyContent="No classes found">
				{sections.map((sectionItem: any) => {
					const id = sectionItem._id
					const email = sectionItem.email
					const time = new Date(parseInt(sectionItem.time)).toLocaleString();
					const sectionIndex = sectionItem.section.current
					const wants = sectionItem.section.wants
					const courseString = sectionItem.courseString
					const courseName = sectionItem.courseName
					const courseInfo = `${courseName} (${courseString})`
					return (
						<TableRow key={id}>
							<TableCell>{courseInfo}</TableCell>
							<TableCell>
								<Chip key={sectionIndex} variant="flat" className="m-1 text-background bg-secondary">{`#${sectionIndex}`}
								</Chip>
							</TableCell>
							<TableCell>{sectionItem.section.wants.map((item: string) =>
								<Chip key={item} variant="flat" className="m-1 text-background bg-primary">{`#${item}`}</Chip>)}</TableCell>
							<TableCell>{time}</TableCell>
							<TableCell>
								<Button as={Link} href={`mailto:${email}`} color="primary">
									Contact
								</Button>
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	);
}

function makeRequest(currentSection: string, wantedSections: string[], email: string | null) {
	if (!email) return
	const timestamp = Date.now()
	const res = fetch('/api/db', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email: email,
			time: timestamp.toString(),
			section: {
				current: currentSection,
				wants: wantedSections
			}
		})
	}).then(res => res.json())
		.then(res => console.log(res))
}

const NewRequestPopover = ({ user }: { user: UserProfile | undefined }) => {
	const [classInfo, setClassInfo] = useState<any[]>([])
	const [sectionInfo, setSectionInfo] = useState<any[]>([])
	const [chosenClass, setChosenClass] = useState<string | null>('')
	const [chosenSection, setChosenSection] = useState<string>('')
	const [chosenWantedSections, setChosenWantedSections] = useState<string[]>([])

	useEffect(() => {
		fetch("/api/db/info/class")
			.then((res) => res.json())
			.then((data) => setClassInfo(data))
	}, [])

	useEffect(() => {
		setChosenWantedSections([])
		fetch(`/api/db/info/section?courseString=${chosenClass}`)
			.then((res) => res.json())
			.then((data) => setSectionInfo(data))
	}, [chosenClass])

	return (
		<PopoverContent>
			<Autocomplete className="w-full h-full p-4" variant="bordered" label="Select a class" defaultItems={classInfo} onSelectionChange={(key) => setChosenClass(key as string)} isVirtualized={false}>
				{
					((item: { _id: string, name: string }) => {
						return (
							<AutocompleteItem key={item._id} textValue={item._id}>
								<div className={jetbrains.className}>
									<strong>{item.name}</strong> ({item._id})
								</div>
							</AutocompleteItem>
						)
					})
				}
			</Autocomplete>
			<Autocomplete className="w-full h-full p-4" variant="bordered" label="Select the section you have" defaultItems={sectionInfo} onSelectionChange={(key) => setChosenSection(key as string)}>
				{
					((item: { _id: string, name: string }) => {
						return (
							<AutocompleteItem key={item._id} textValue={item._id}>
								<div className={jetbrains.className}>
									#{item._id}
								</div>
							</AutocompleteItem>
						)
					})
				}
			</Autocomplete>
			<div className="flex flex-row flex-wrap gap-3">
				<CheckboxGroup label="Select the sections you want to trade with" orientation="horizontal" value={chosenWantedSections} onChange={setChosenWantedSections}>
					{
						sectionInfo.map((item: { _id: string, name: string }) => {
							if (item._id === chosenSection) return null
							return (
								<Checkbox key={item._id} value={item._id}>
									{`#${item._id}`}
								</Checkbox>
							)
						})
					}
				</CheckboxGroup>
			</div>
			<Button onPress={() => {
				makeRequest(chosenSection, chosenWantedSections, user?.email ?? null)
			}}>Submit</Button>
		</PopoverContent>
	)
}
