import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@/components/ui/combobox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type FieldOrientation } from "@/utils/type";
import { SelectData, useFieldContext } from "../formContext";

export function ComboBoxField({
	label,
	selectData = [{ label: "ไม่มีข้อมูล", value: "" }],
	placeholder = "โปรดเลือก",
	emptyMessage = "ไม่มีข้อมูล",
	orientation = "responsive",
}: {
	label: string;
	selectData: SelectData[];
	placeholder?: string;
	emptyMessage?: string;
	orientation?: FieldOrientation;
}) {
	const field = useFieldContext<string>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	return (
		<Field orientation={orientation} data-invalid={isInvalid}>
			<Field>
				<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
				<Combobox
					items={selectData}
					itemToStringValue={(product: SelectData) => product.label}
					onValueChange={(value) => field.handleChange(value?.value ?? "")}
				>
					<ComboboxInput placeholder={placeholder} />
					<ComboboxContent>
						<ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
						<ComboboxList>
							{(item: SelectData) => (
								<ComboboxItem key={item.value} value={item}>
									{item.label}
								</ComboboxItem>
							)}
						</ComboboxList>
					</ComboboxContent>
				</Combobox>
			</Field>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
