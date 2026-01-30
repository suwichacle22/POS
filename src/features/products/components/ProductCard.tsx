import { useState } from "react";
import RemoveDialog from "@/components/RemoveDialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { ProductWithPrices } from "@/features/products/types";
import { transformDateThai } from "@/utils/date";
import { useDeleteProduct } from "../hooks";
import ProductPriceForm from "./ProductPriceForm";
import ProductPriceTable from "./ProductPriceTable";

export default function ProductCard({ item }: { item: ProductWithPrices }) {
	const [isDelete, setIsDelete] = useState(false);
	const [isAddProductPrice, setIsAddProductPrice] = useState(false);
	const handleDelete = () => {
		setIsDelete(true);
	};
	const handleAddProductPrice = () => {
		setIsAddProductPrice((c) => !c);
	};
	const deleteFn = useDeleteProduct();

	return (
		<Card className="w-[330px]">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">{item.productName}</CardTitle>
				<p className="font-bold text-xl">
					ราคาล่าสุด {item?.productPrices?.[0]?.price ?? "0.00"}
				</p>
				<CardDescription>แบ่งแบบ {item.defaultSplitType}</CardDescription>
			</CardHeader>
			<CardContent>
				<Button variant="secondary" onClick={handleAddProductPrice}>
					{isAddProductPrice ? "กดที่นี้เพื่อปิดราคา" : "กดที่นี้เพื่อเพิ่มราคา"}
				</Button>
				{isAddProductPrice ? (
					<ProductPriceForm
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
					<RemoveDialog
						isDelete={isDelete}
						setIsDelete={setIsDelete}
						itemId={item.productId}
						itemName={item.productName}
						mutationDeleteFn={deleteFn}
					/>
				) : null}
			</CardFooter>
		</Card>
	);
}
