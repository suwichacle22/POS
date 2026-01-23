import { createFormHook } from "@tanstack/react-form";
import { Card } from "@/components/ui/card";

const { useAppForm, withForm } = createFormHook({
	fieldComponents: {
		TextField,
	},
	formComponents: {
		SubscribeButton,
	},
	fieldContext,
	formContext,
});

export const TransactionGroupCard = withForm;
