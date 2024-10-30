import { useState, useEffect } from "react";
import { useGetProducts } from "../hooks/queries";
import { deleteProduct } from "../service";
import { Button, Space, Tooltip, message } from "antd";
import { GlobalTable, Search } from "@components";
import DrawerModal from "./drawer";
import { PaginationType } from "../types";
import { EditFilled, EyeFilled, CloseCircleFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const Index = () => {
  const [params, setParams] = useState({ limit: 2, page: 1, search: "" });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { search: searchParams } = useLocation();
  const navigate = useNavigate();
  const { data, refetch } = useGetProducts(params);
  const { products, count } = data || {};

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    setParams({
      limit: Number(params.get("limit")) || 5,
      page: Number(params.get("page")) || 1,
      search: params.get("search") || "",
    });
  }, [searchParams]);

  const openEditDrawer = (product: any) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const deleteProductHandler = async (id: any) => {
    try {
      await deleteProduct(id);
      message.success("Product deleted successfully");
      refetch();
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  const handleTableChange = (pagination: PaginationType) => {
    const { pageSize, current } = pagination;
    setParams({ limit: pageSize, page: current });
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set("limit", `${pageSize}`);
    updatedParams.set("page", `${current}`);
    navigate(`?${updatedParams}`);
  };

  const handleSearch = (value: string) => {
    setParams((prev) => ({ ...prev, search: value }));
  };

  const columns = [
    {
      title: "№",
      dataIndex: "index",
      key: "index",
      render: (_text: string, _record: any, index: number) =>
        `${(params.page - 1) * params.limit + index + 1}`,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_text: string, record: any) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="default"
              onClick={() => openEditDrawer(record)}
              icon={<EditFilled />}
              style={{ width: "45px", color: "#1890ff", borderColor: "#1890ff" }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              onClick={() => deleteProductHandler(record.id)}
              style={{ width: "45px", color: "#ff4d4f", borderColor: "#ff4d4f" }}
              icon={<CloseCircleFilled />}
            />
          </Tooltip>
          <Tooltip title="View">
            <Button
              onClick={() => navigate(`/admin-layout/category/${record.id}`)}
              icon={<EyeFilled />}
              style={{ width: "45px", color: "#52c41a", borderColor: "#52c41a" }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <DrawerModal open={isDrawerOpen} update={selectedProduct} handleCancel={() => setIsDrawerOpen(false)} />
      <div className="flex justify-between mb-5">
        <Search placeholder="Search product..." onSearch={handleSearch} searchParamKey="" />
        <Button type="primary" onClick={() => setIsDrawerOpen(true)}>Add Product</Button>
      </div>
      <GlobalTable
        data={products}
        columns={columns}
        pagination={{
          current: params.page,
          pageSize: params.limit,
          total: count,
          showSizeChanger: true,
          pageSizeOptions: ["2", "5", "7", "10"],
        }}
        onChange={handleTableChange}
      />
    </div>
  );
};

export default Index;
