import { IconPlus } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function NavBar() {
	const pages = [
		{
			Name: "หน้าหลัก",
			Link: "/",
		},
		{
			Name: "สินค้า",
			Link: "/products",
		},
		{
			Name: "ลูกค้า",
			Link: "/farmers",
		},
	];
	return (
		<>
			<div className="flex justify-between items-center mt-1 w-full">
				<NavigationMenu>
					<NavigationMenuList>
						{pages.map((page) => {
							return (
								<NavigationMenuItem key={page.Name}>
									<NavigationMenuLink
										key={page.Name}
										render={<Link to={page.Link}>{page.Name}</Link>}
									/>
								</NavigationMenuItem>
							);
						})}
					</NavigationMenuList>
				</NavigationMenu>
				<div>
					<Link to="/transactions" className="inline-flex items-center gap-2">
						<Separator orientation="vertical" />
						<Button variant="default" className="text-xl">
							<IconPlus />
							รายการซื้อ
						</Button>
					</Link>
				</div>
			</div>
			<Separator className="" />
		</>
	);
}
