import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, deleteProduct } from "../service";
import { toast } from "react-toastify";




export function useCreateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: FormData) => createProduct(data),
        onSuccess: (response) => {
            toast.success(response?.message);
        },
        onSettled: (_, error) => {
            if (error) {
                toast.error(error?.message);
            } else {
                queryClient.invalidateQueries({ queryKey: ["product"] });
            }
        },
    });
}




export function useDeleteProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => deleteProduct(id),
        onSuccess: (response) => {
            toast.success(response?.message);
        },
        onSettled: (_, error) => {
            if (error) {
                toast.error(error?.message);
            } else {
                queryClient.invalidateQueries({ queryKey: ["product"] });
            }
        },
    });
}
