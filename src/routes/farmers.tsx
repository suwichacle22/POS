import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fetchFarmer } from "@/features/farmers/api";
import AddFarmerForm from "@/features/farmers/components/farmers/AddFarmerForm";
import FarmerCard from "@/features/farmers/components/farmers/farmerCard";

export const Route = createFileRoute("/farmers")({
	component: RouteComponent,
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData({
			queryKey: ["farmer"],
			queryFn: fetchFarmer,
		});
	},
});

function RouteComponent() {
	const { data: farmerData = [] } = useQuery({
		queryKey: ["farmer"],
		queryFn: fetchFarmer,
	});
	return (
		<div className="grid grid-cols-1 lg:grid-cols-4 ">
			<div className="col-span-1 p-4 flex justify-center items-center">
				<AddFarmerForm />
			</div>
			<div className="col-span-1 lg:col-span-3 grid grid-cols-1 p-4 gap-4">
				{farmerData?.map((farmer) => (
					<FarmerCard key={farmer.farmerId} farmerData={farmer} />
				))}
			</div>
		</div>
	);
}
