import { useState, useEffect } from "react";
import { Button, Space, Tooltip } from "antd";
import { EditFilled, EyeFilled, CloseCircleFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { GlobalTable, Search } from "@components";
import { useGetCategory } from "../hooks/queries";
import { useDeleteCategory } from "../hooks/mutation";
import PageModal from "./modal";

const CategoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [queryParams, setQueryParams] = useState({ limit: 2, page: 1, search: "" });
  const navigateTo = useNavigate();
  const { search: searchParams } = useLocation();
  const { categories, count } = useGetCategory(queryParams)?.data || {};
  const { mutate: removeCategory } = useDeleteCategory();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    setQueryParams({
      limit: Number(params.get("limit")) || 5,
      page: Number(params.get("page")) || 1,
      search: params.get("search") || "",
    });
  }, [searchParams]);

  const onTableChange = (pagination: any) => {
    const { pageSize, current } = pagination;
    setQueryParams({ limit: pageSize, page: current });
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set("limit", `${pageSize}`);
    updatedParams.set("page", `${current}`);
    navigateTo(`?${updatedParams}`);
  };

  const openEditModal = (category: any) => {
    setSelectedCategory(category);
    setIsModalVisible(true);
  };

  const deleteCategory = (id: any) => {
    removeCategory(id);
  };

  const onSearch = (value: string) => {
    setQueryParams((prev) => ({ ...prev, search: value }));
  };

  const columnsDefinition = [
    {
      title: "№",
      dataIndex: "index",
      key: "index",
      render: (_text: string, _record: any, index: number) =>
        `${(queryParams.page - 1) * queryParams.limit + index + 1}`,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      onCell: (record: any) => ({
        onClick: () => navigateTo(`/admin-layout/category/${record.id}`),
        style: { cursor: "pointer" },
      }),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_text: string, record: any) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button
              type="default"
              onClick={() => openEditModal(record)}
              icon={<EditFilled />}
              style={{ width: "45px", color: "#1890ff", borderColor: "#1890ff" }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              onClick={() => deleteCategory(record.id)}
              style={{ width: "45px", color: "#ff4d4f", borderColor: "#ff4d4f" }}
              icon={<CloseCircleFilled />}
            />
          </Tooltip>
          <Tooltip title="View">
            <Button
              onClick={() => navigateTo(`/admin-layout/category/${record.id}`)}
              icon={<EyeFilled />}
              style={{ width: "45px", color: "#52c41a", borderColor: "#52c41a" }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <PageModal open={isModalVisible} handleCancel={() => setIsModalVisible(false)} update={selectedCategory} />
      <div className="flex justify-between mb-5">
        <Search placeholder="Search category..." onSearch={onSearch} searchParamKey={""} />
        <Button type="primary" onClick={() => setIsModalVisible(true)}>Add Category</Button>
      </div>
      <GlobalTable
        data={categories}
        columns={columnsDefinition}
        pagination={{
          current: queryParams.page,
          pageSize: queryParams.limit,
          total: count,
          showSizeChanger: true,
          pageSizeOptions: ["2", "5", "7", "10"],
        }}
        onChange={onTableChange}
      />
    </>
  );
};

export default CategoryPage;
