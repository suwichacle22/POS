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
import { Separator } from "@/components/ui/separator";
import { useDeleteFarmer, useEmployees } from "../../hooks";
import { type FarmerSchema } from "../../schemas";
import AddEmployeeForm from "../employees/AddEmployeeForm";
import EmployeeCard from "../employees/EmployeeCard";
import RemoveFarmerDialog from "./RemoveFarmerDialog";

export default function FarmerCard({
	farmerData,
}: {
	farmerData: FarmerSchema;
}) {
	const [isDelete, setIsDelete] = useState(false);
	const [isAddEmployee, setIsAddEmployee] = useState(false);
	const { data: employeesData = [] } = useEmployees({
		farmerId: farmerData.farmerId,
	});
	const deleteFarmerFn = useDeleteFarmer();
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-2xl font-bold">
					{farmerData.displayName}
				</CardTitle>
				<CardAction>
					<Button
						type="button"
						onClick={() => setIsAddEmployee((c) => !c)}
						variant={isAddEmployee ? "outline" : "default"}
					>
						เพิ่มลูกน้อง
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				{isAddEmployee ? (
					<>
						<AddEmployeeForm
							isAddEmployee={isAddEmployee}
							setIsAddEmployee={setIsAddEmployee}
							farmerId={farmerData.farmerId}
						/>
						<Separator className="my-4" />
					</>
				) : null}
				{employeesData.map((employee) => {
					return (
						<div key={employee.employeeId} className="flex flex-col m-2 gap-4">
							<EmployeeCard key={employee.employeeId} employeeData={employee} />
						</div>
					);
				})}
			</CardContent>
			<CardFooter className="flex justify-end">
				<Button variant="outline" onClick={() => setIsDelete(true)}>
					ลบลูกค้า
				</Button>
				{isDelete ? (
					<RemoveDialog
						isDelete={isDelete}
						setIsDelete={setIsDelete}
						itemId={farmerData.farmerId}
						itemName={farmerData.displayName}
						mutationDeleteFn={deleteFarmerFn}
					/>
				) : null}
			</CardFooter>
		</Card>
	);
}
