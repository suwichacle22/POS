import { withForm } from "@/components/form/formContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { transactionFormOpts } from "../schemas";

export const TransactionGroupForm = withForm({
	...transactionFormOpts,
	render: ({ form }) => {
		return (
			<Card className="w-[330px]">
				<CardHeader>ลูกค้า</CardHeader>
				<CardContent>
					<FieldGroup>
						<form.AppField
							name="transactionGroup.farmerId"
							children={(field) => (
								<field.AutoCompleteField
									label="ลูกค้า"
									placeholder="ชื่อลูกค้า"
									// selectData={[{ label: "ไม่มีข้อมูล", value: "" }]}
								/>
							)}
						/>
					</FieldGroup>
				</CardContent>
			</Card>
		);
	},
});
