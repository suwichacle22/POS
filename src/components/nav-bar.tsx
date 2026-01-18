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

export default function NavBar() {
	const pages = [
		{
			Name: "หน้าหลัก",
			Link: "/",
		},
		{
			Name: "สินค้า",
			Link: "/product",
		},
	];
	return (
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
	);
}
