import { type EmployeeSplitProductSchemaTable } from "../../schemas";

export default function EmployeeCard({
	employeeData,
}: {
	employeeData: EmployeeSplitProductSchemaTable;
}) {
	return (
		<div>
			<h1>{employeeData.displayName}</h1>
		</div>
	);
}
