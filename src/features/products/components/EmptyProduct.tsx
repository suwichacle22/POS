import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { IconShoppingCartOff } from "@tabler/icons-react";

export default function EmptyProduct() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<IconShoppingCartOff />
				</EmptyMedia>
				<EmptyTitle>โปรดเพิ่มสินค้า</EmptyTitle>
			</EmptyHeader>
		</Empty>
	);
}
