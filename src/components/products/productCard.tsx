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
import AddProductPriceForm from "./product-price/addProductPriceForm";
import ProductPriceTable from "./product-price/productPriceTable";
import DeleteProductDialog from "./removeProductDialog";

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
	const [isAddProductPrice, setIsAddProductPrice] = useState(false);
	const handleDelete = () => {
		setIsDelete(true);
	};
	const handleAddProductPrice = () => {
		setIsAddProductPrice((c) => !c);
	};

	return (
		<Card className="w-120">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">{item.productName}</CardTitle>
				<CardDescription>{`สร้างเมื่อ ${transformDateThai(item.createdAt as Date)}`}</CardDescription>
				<CardAction>
					<Button variant="secondary" onClick={handleAddProductPrice}>
						{isAddProductPrice ? "กดที่นี้เพื่อปิดราคา" : "กดที่นี้เพื่อเพิ่มราคา"}
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<p className="font-bold text-xl">
					ราคาล่าสุด {item?.productPrices?.[0]?.price ?? "0.00"}
				</p>
				{isAddProductPrice ? (
					<AddProductPriceForm
						productId={item.productId}
						setIsAddProductPrice={setIsAddProductPrice}
					/>
				) : null}
				{item.productPrices.length > 0 ? (
					<ProductPriceTable productPrices={item.productPrices} />
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
