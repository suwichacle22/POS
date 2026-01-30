import {
	Autocomplete,
	AutocompleteContent,
	AutocompleteEmpty,
	AutocompleteInput,
	AutocompleteItem,
	AutocompleteList,
} from "@/components/ui/base-autocomplete";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { SelectData, useFieldContext } from "../formContext";

export function AutoCompleteField({
	label,
	placeholder,
	selectData = [{ label: "ไม่มีข้อมูล", value: "" }],
	emptyMessage = "ไม่มีข้อมูล",
}: {
	label: string;
	placeholder: string;
	selectData?: SelectData[];
	emptyMessage?: string;
}) {
	const field = useFieldContext<string>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	return (
		<Field className="w-full max-w-xs">
			<Autocomplete
				items={selectData}
				value={field.state.value}
				onValueChange={(value) => field.handleChange(value)}
				itemToStringValue={(selectData: unknown) =>
					(selectData as SelectData).value
				}
			>
				<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
				<AutocompleteInput
					id={field.name}
					placeholder={placeholder}
					className="mt-2"
				/>
				<AutocompleteContent>
					<AutocompleteEmpty>{emptyMessage}</AutocompleteEmpty>
					<AutocompleteList>
						{(item) => (
							<AutocompleteItem key={item.id} value={item.value}>
								{item.value}
							</AutocompleteItem>
						)}
					</AutocompleteList>
				</AutocompleteContent>
			</Autocomplete>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
