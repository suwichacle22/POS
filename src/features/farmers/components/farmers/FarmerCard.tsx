import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useEmployees } from "../../hooks";
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
					<AddEmployeeForm
						isAddEmployee={isAddEmployee}
						setIsAddEmployee={setIsAddEmployee}
						farmerId={farmerData.farmerId}
					/>
				) : null}
				{employeesData.map((employee) => {
					return (
						<EmployeeCard key={employee.employeeId} employeeData={employee} />
					);
				})}
			</CardContent>
			<CardFooter className="flex justify-end">
				<Button variant="outline" onClick={() => setIsDelete(true)}>
					ลบลูกค้า
				</Button>
				{isDelete ? (
					<RemoveFarmerDialog
						isDelete={isDelete}
						setIsDelete={setIsDelete}
						farmerId={farmerData.farmerId}
						farmerName={farmerData.displayName}
					/>
				) : null}
			</CardFooter>
		</Card>
	);
}
