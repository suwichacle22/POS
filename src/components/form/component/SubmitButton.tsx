import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useFormContext } from "../formContext";

export function SubmitButton() {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => {
				console.log("isSubmitting", isSubmitting);
				return (
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? <Spinner /> : null} ยืนยัน
					</Button>
				);
			}}
		</form.Subscribe>
	);
}
