import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type FieldOrientation } from "@/utils/type";
import { useFieldContext } from "../formContext";

export function SelectField({
	label,
	items,
	orientation = "responsive",
}: {
	label: string;
	items: { value: string; label: string }[];
	orientation?: FieldOrientation;
}) {
	const field = useFieldContext<string>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
	return (
		<Field orientation={orientation} data-invalid={isInvalid}>
			<FieldLabel htmlFor={field.name}>{label}</FieldLabel>
			<Select
				name={field.name}
				value={field.state.value}
				items={items}
				onValueChange={(e) => field.handleChange(e as string)}
			>
				<SelectTrigger aria-invalid={isInvalid} className="min-w-30">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{items.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			{isInvalid && <FieldError errors={field.state.meta.errors} />}
		</Field>
	);
}
