import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteProduct } from "@/features/products/hooks";
import { Spinner } from "@/components/ui/spinner";

export default function RemoveProductDialog({
	isDelete,
	setIsDelete,
	productId,
	productName,
}: {
	isDelete: boolean;
	setIsDelete: (v: boolean) => void;
	productId: string;
	productName: string;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const deleteFn = useDeleteProduct();
	return (
		<AlertDialog open={isDelete} onOpenChange={setIsDelete}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>ยืนยันการลบสินค้า {productName}</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>ยกเลิก</AlertDialogCancel>
					<AlertDialogAction
						className="bg-red-700"
						onClick={() => {
							setIsLoading(true);
							deleteFn.mutate(
								{ data: { productId } },
								{
									onSuccess: () => {
										setIsDelete(false);
										setIsLoading(false);
									},
								},
							);
						}}
						disabled={isLoading}
					>
						{isLoading && <Spinner />}ลบข้อมูล {productName}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
