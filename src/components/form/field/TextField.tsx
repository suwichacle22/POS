import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type FieldOrientation } from "@/utils/type";
import { useFieldContext } from "../formContext";

export function TextField({
	label,
	placeholder,
	orientation = "responsive",
}: {
	label: string;
	placeholder: string;
	orientation?: FieldOrientation;
}) {
	const field = useFieldContext<string>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	return (
		<Field orientation={orientation} data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
			<Input
				id={field.name}
				name={field.name}
				value={field.state.value}
				onChange={(e) => field.handleChange(e.target.value)}
				autoComplete="off"
				aria-invalid={isInvalid}
				placeholder={placeholder}
			/>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
