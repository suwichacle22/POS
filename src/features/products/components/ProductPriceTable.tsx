export default function ProductPriceTable({
	productPrices,
}: {
	productPrices: {
		productId: string;
		price: string;
		createdAt: Date | null;
		productPriceId: string;
	}[];
}) {
	return (
		<div className="flex flex-col gap-2 mt-4 border-t border-gray-500 pt-4">
			<div className="flex gap-2">
				<span className="flex gap-2">วันที่</span>
				{productPrices.map((productPrice) => (
					<span key={productPrice.productPriceId} className="w-14 text-center">
						{productPrice.createdAt?.getDate()}
					</span>
				))}
			</div>
			<div className="flex gap-2">
				<span className="font-medium">ราคา</span>
				{productPrices.map((productPrice) => (
					<span key={productPrice.productPriceId} className="w-14 text-center">
						{productPrice.price}
					</span>
				))}
			</div>
		</div>
	);
}
