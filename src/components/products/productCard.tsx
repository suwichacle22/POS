import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { transformDateThai } from "@/utils/date";

export default function ProductCard({
	item,
}: {
	item: {
		createdAt: Date | null;
		updatedAt: Date | null;
		productId: string;
		productName: string;
		defaultSplitType: "percentage" | "per_kg";
	};
}) {
	return (
		<Card className="w-120">
			<CardHeader>
				<CardTitle>{item.productName}</CardTitle>
				<CardDescription>{`สร้างเมื่อ ${transformDateThai(item.createdAt as Date)}`}</CardDescription>
				<CardAction>Card Action</CardAction>
			</CardHeader>
			<CardContent>
				<p>Card Content</p>
			</CardContent>
			<CardFooter>
				<p>Card Footer</p>
			</CardFooter>
		</Card>
	);
}
