import { createBrand, deleteBrand, updateBrand } from "../service";
import { Notification } from "../../../utils/notifications";
import { BrandType } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// ========= CREATE ===========




export function useCreateBrand() {
    const queryClient = useQueryClient()
   return useMutation({
    mutationFn: (data:FormData)=> createBrand(data),
    onSuccess:(response)=>{
        Notification({
            type: "success",
            message: response?.message,
        });
    },
    onSettled:async (_,error)=>{
        if(error){
            Notification({
                    type: "success",
                    message: error?.message,
                });
        }else {
           await   queryClient.invalidateQueries({queryKey: ["brand"]})
        }
    }
   })
}

// ========= UPDATE ===========
export function useUpdateBrand() {
    const queryClient = useQueryClient()
   return useMutation({
    mutationFn: (data: BrandType)=> updateBrand(data),
    onSuccess:(response)=>{
        Notification({
            type: "success",
            message: response?.message,
        });
    },
    onSettled:async (_,error)=>{
        if(error){
            Notification({
                    type: "success",
                    message: error?.message,
                });
        }else {
            await queryClient.invalidateQueries({queryKey: ["brand"]})
        }
    }
   })
}






// ========= DELETE ===========
export function useDeleteBrand() {
    const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string | number) => deleteBrand(id),
    onSuccess:(response)=>{
        Notification({
            type: "success",
            message: response?.message,
        });
    },
    onSettled:async (_,error)=>{
        if(error){
            Notification({
                    type: "success",
                    message: error?.message,
                });
        }else {
           await  queryClient.invalidateQueries({queryKey: ["brand"]})
        }
    }
  });
}