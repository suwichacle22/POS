import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	addProductDB,
	addProductPriceDB,
	deleteProductDB,
} from "./api";

export const useAddProduct = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: addProductDB,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["product"] });
		},
	});
};

export const useAddProductPrice = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: addProductPriceDB,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["product"] });
		},
	});
};

export const useDeleteProduct = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteProductDB,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["product"] });
		},
	});
};
