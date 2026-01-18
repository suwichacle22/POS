import { useState } from "react";
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
import { Button } from "../ui/button";
import AddProductPriceForm from "./product-price/add-product-price-form";
import DeleteProductDialog from "./remove-product-dialog";

export default function ProductCard({
	item,
}: {
	item: {
		createdAt: Date | null;
		updatedAt: Date | null;
		productId: string;
		productName: string;
		defaultSplitType: "percentage" | "per_kg";
		productPrices: {
			productId: string;
			price: string;
			createdAt: Date | null;
			productPriceId: string;
		}[];
	};
}) {
	const [isDelete, setIsDelete] = useState(false);
	const [isAddProductPrice, setIsAddProductPrice] = useState(true); //TODO change to false when finish
	const handleDelete = () => {
		setIsDelete(true);
	};
	return (
		<Card className="w-120">
			<CardHeader>
				<CardTitle>{item.productName}</CardTitle>
				<CardDescription>{`สร้างเมื่อ ${transformDateThai(item.createdAt as Date)}`}</CardDescription>
				<CardAction>Click ที่ Card เพื่อใส่ราคา</CardAction>
			</CardHeader>
			<CardContent>
				<p>ราคาล่าสุด {item?.productPrices?.[0]?.price ?? "0.00"}</p>
				{isAddProductPrice ? (
					<AddProductPriceForm productId={item.productId} />
				) : null}
			</CardContent>
			<CardFooter className="flex justify-end">
				<Button variant="outline" onClick={handleDelete}>
					ลบ
				</Button>
				{isDelete ? (
					<DeleteProductDialog
						isDelete={isDelete}
						setIsDelete={setIsDelete}
						productId={item.productId}
						productName={item.productName}
					/>
				) : null}
			</CardFooter>
		</Card>
	);
}
