import { type UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
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

export default function RemoveDialog<
	TData = unknown,
	TError = Error,
	TVariables = unknown,
>({
	isDelete,
	setIsDelete,
	itemId,
	itemName,
	mutationDeleteFn,
}: {
	isDelete: boolean;
	setIsDelete: (v: boolean) => void;
	itemId: string;
	itemName: string;
	mutationDeleteFn: UseMutationResult<TData, TError, TVariables>;
}) {
	const [isLoading, setIsLoading] = useState(false);
	const handleDelete = async () => {
		setIsLoading(true);
		await mutationDeleteFn.mutateAsync({ data: { id: itemId } } as TVariables, {
			onSuccess: () => {
				setIsDelete(false);
				setIsLoading(false);
			},
			onError: () => {
				setIsLoading(false);
				toast.error(`ลบข้อมูล ${itemName} ไม่สำเร็จ`);
			},
		});
	};
	return (
		<AlertDialog open={isDelete} onOpenChange={setIsDelete}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>ยืนยันการลบ: {itemName}</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>ยกเลิก</AlertDialogCancel>
					<AlertDialogAction
						className="bg-red-700"
						onClick={handleDelete}
						disabled={isLoading}
					>
						{isLoading && <Spinner />}ยืนยันการลบข้อมูล: {itemName}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
