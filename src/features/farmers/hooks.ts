import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	addEmployeeDB,
	addFarmerDB,
	deleteFarmerDB,
	fetchEmployee,
	fetchFarmer,
} from "./api";

export const useFarmers = () => {
	return useQuery({
		queryKey: ["farmer"],
		queryFn: fetchFarmer,
	});
};

export const useAddFarmer = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: addFarmerDB,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["farmer"] });
		},
	});
};

export const useDeleteFarmer = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteFarmerDB,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["farmer"] });
		},
	});
};

//Employee Section

export const useEmployees = ({ farmerId }: { farmerId: string }) => {
	return useQuery({
		queryKey: ["employee", farmerId],
		queryFn: () => fetchEmployee({ data: { farmerId } }),
	});
};

export const useAddEmployee = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: addEmployeeDB,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["employee"] });
		},
	});
};
