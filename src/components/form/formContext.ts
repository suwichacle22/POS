import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { SubmitButton } from "./component/SubmitButton";
import { AutoCompleteField } from "./field/AutoCompleteField";
import { ComboBoxField } from "./field/ComboBoxField";
import { NumericField } from "./field/NumericField";
import { SelectField } from "./field/SelectField";
import { TextField } from "./field/TextField";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		NumericField,
		TextField,
		ComboBoxField,
		SelectField,
		AutoCompleteField,
	},
	formComponents: { SubmitButton },
});

export type SelectData = { label: string; value: string };
