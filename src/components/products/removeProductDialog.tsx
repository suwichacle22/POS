import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteProduct } from "@/utils/product";
import { Spinner } from "../ui/spinner";

export default function DeleteProductDialog({
	isDelete,
	setIsDelete,
	productId,
	productName,
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
