import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { fetchProductWithPrice } from "@/features/products/api";
import AddProductForm from "@/features/products/components/AddProductForm";
import EmptyProduct from "@/features/products/components/EmptyProduct";
import ProductCard from "@/features/products/components/ProductCard";

export const Route = createFileRoute("/products")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData({
			queryKey: ["product"],
			queryFn: fetchProductWithPrice,
		});
	},
	pendingComponent: () => {
		return (
			<div className="flex items-center gap-6 justify-center h-screen">
				<Spinner className="size-8" />
			</div>
		);
	},
});

function RouteComponent() {
	const { data: productData = [] } = useQuery({
		queryKey: ["product"],
		queryFn: fetchProductWithPrice,
	});
	const [isAddProduct, setIsAddProduct] = useState(false);
	const handleIsAddProductClick = () => {
		setIsAddProduct((c) => !c);
	};
	return (
		<div className="">
			<div className="flex flex-row justify-end p-2 w-full">
				<Button
					type="button"
					onClick={handleIsAddProductClick}
					variant={isAddProduct ? "destructive" : "default"}
				>
					เพิ่มสินค้า
				</Button>
			</div>
			{isAddProduct ? (
				<>
					<div className="flex justify-center">
						<AddProductForm
							handleIsAddProductClick={handleIsAddProductClick}
							setIsAddProduct={setIsAddProduct}
						/>
					</div>
					<Separator className="m-6" />
				</>
			) : null}
			{productData.length === 0 ? <EmptyProduct /> : null}
			<div className="grid grid-cols-1 lg:grid-cols-3 justify-items-center gap-4 ">
				{productData.map((item) => {
					return <ProductCard key={item.productId} item={item} />;
				})}
			</div>
		</div>
	);
}
