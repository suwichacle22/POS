import { PlusIcon } from "lucide-react";
import { useState } from "react";
import RemoveDialog from "@/components/RemoveDialog";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useDeleteEmployee } from "../../hooks";
import { type EmployeeSplitProductSchemaTable } from "../../schemas";
import EmployeeSplitProductForm from "./EmployeeSplitProductForm";

export default function EmployeeCard({
	employeeData,
}: {
	employeeData: EmployeeSplitProductSchemaTable;
}) {
	const [isAddSplitProduct, setIsAddSplitProduct] = useState(false);
	const [isDelete, setIsDelete] = useState(false);
	const deleteEmployee = useDeleteEmployee();
	return (
		<Card>
			<CardHeader>
				<CardTitle>{employeeData.displayName}</CardTitle>
				<CardAction>
					<Button
						variant="secondary"
						type="button"
						onClick={() => setIsAddSplitProduct((c) => !c)}
					>
						{<PlusIcon />}เพิ่มแบ่งโดยสินค้า
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				{isAddSplitProduct ? (
					<EmployeeSplitProductForm
						employeeId={employeeData.employeeId}
						setIsAddSplitProduct={setIsAddSplitProduct}
					/>
				) : null}
				{/* {employeeData?.splitDefaults?.map((splitDefault) => {})} */}
			</CardContent>
			<CardFooter className="flex justify-end">
				<Button variant="outline" onClick={() => setIsDelete(true)}>
					ลบ
				</Button>
				{isDelete && (
					<RemoveDialog
						isDelete={isDelete}
						setIsDelete={setIsDelete}
						itemId={employeeData.employeeId}
						itemName={employeeData.displayName}
						mutationDeleteFn={deleteEmployee}
					/>
				)}
			</CardFooter>
		</Card>
	);
}
