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
import { Spinner } from "@/components/ui/spinner";
import { useDeleteFarmer } from "../../hooks";

export default function RemoveFarmerDialog({
	isDelete,
	setIsDelete,
	farmerId,
	farmerName,
}: {
	isDelete: boolean;
	setIsDelete: (v: boolean) => void;
	farmerId: string;
	farmerName: string;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const deleteFn = useDeleteFarmer();
	return (
		<AlertDialog open={isDelete} onOpenChange={setIsDelete}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>ยืนยันการลูกค้า: {farmerName}</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>ยกเลิก</AlertDialogCancel>
					<AlertDialogAction
						className="bg-red-700"
						onClick={() => {
							setIsLoading(true);
							deleteFn.mutate(
								{ data: { farmerId } },
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
						{isLoading && <Spinner />}ลบข้อมูล {farmerName}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
