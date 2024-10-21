import axiosInstance from "@api";
import { ParamsType } from "@types";
import { BrandType } from "../types";
// ========= GET ===========
export const getBrand = async (params: ParamsType) => {
  const response = await axiosInstance.get("brand/search", {
    params,
  });
  return response.data?.data;
};

// ========= CREATE ===========
export const createBrand = async (data: FormData) => {
  const response = await axiosInstance.post("brand/create", data);
  return response?.data;
};

// ========= Update ===========
export const updateBrand = async (data: BrandType) => {
  const { id } = data;
  delete data.id
  delete data.category_id
  const response = await axiosInstance.patch(`brand/update/${id}`, data);
  return response?.data;
};

// ========= DELETE ===========
export const deleteBrand = async (id: string | number) => {
  const response = await axiosInstance.delete(`brand/delete/${id}`);
  return response?.data;
};