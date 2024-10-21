import { useState, useEffect } from "react";
import { Button, Space, Tooltip } from "antd";
import { EditFilled, EyeFilled, CloseCircleFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { GlobalTable, ConfirmDelete, Search } from "@components";
import { useGetCategory } from "../hooks/queries";
import { useDeleteCategory } from "../hooks/mutation";
import { ColumnsType, PaginationType } from "../types";
import PageModal from "./modal";

const Index = () => {
    const [update, setUpdate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [params, setParams] = useState({
        limit: 2,
        page: 1,
        search: ""
    });
    const navigate = useNavigate();
    const { search } = useLocation();
    const { categories, count } = useGetCategory(params)?.data || {};
    const { mutate: deleteCategory } = useDeleteCategory();

    const handleTableChange = (pagination: PaginationType) => {
        const { pageSize, current } = pagination;
        setParams((prev) => ({
           ...prev,
           limit: pageSize,
           page: current,
        }));
        const current_params = new URLSearchParams(search);
        current_params.set("limit", `${pageSize}`);
        current_params.set("page", `${current}`);
        navigate(`?${current_params}`);
     };

    const editData = (data: any) => {
        setUpdate(data);
        setModalVisible(true);
    };
    const deleteData = (id: any) => {
        deleteCategory(id);
    };
    const handleCancel = () => {
        setUpdate(null);
        setModalVisible(false);
    };
    const handleSearch = (value: string) => {
        setParams((prev) => ({
           ...prev,
           search: value,
        }));
     };

    useEffect(() => {
        const params = new URLSearchParams(search);
        const page = Number(params.get("page")) || 1;
        const limit = Number(params.get("limit")) || 5;
        const search_val = params.get("search") || "";
        setParams((prev) => ({
            ...prev,
            search: search_val,
            page: page,
            limit: limit,
        }));
    }, [search]);

    const columns = [
        {
            title: '№',
            dataIndex: 'index',
            key: 'index',
            render: (_text: string, _record: any, index: number) =>
                `${(params.page - 1) * params.limit + index + 1}`,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            onCell: (record: ColumnsType) => ({
                onClick: () => navigate(`/admin-layout/category/${record.id}`),
                style: { cursor: "pointer" },
            }),
        },
        {
            title: "Action",
            key: "action",
            render: (_text: string, record: ColumnsType) => (
                <Space size={"middle"}>
                    <Tooltip title="Edit">
                        <Button
                            type="default"
                            onClick={() => editData(record)}
                            icon={<EditFilled />}
                            style={{ width: "45px", color: "#1890ff", borderColor: "#1890ff" }}
                        />
                    </Tooltip>
                    <ConfirmDelete
                        title="Delete category?"
                        description="Are you sure to delete this category?"
                        onConfirm={() => deleteData(record.id)}
                    >
                        <Tooltip title="Delete">
                            <Button style={{ width: "45px", color: "#ff4d4f", borderColor: "#ff4d4f" }}>
                                <CloseCircleFilled />
                            </Button>
                        </Tooltip>
                    </ConfirmDelete>
                    <Tooltip title="View">
                        <Button
                            type="default"
                            icon={<EyeFilled />}
                            onClick={() => navigate(`/admin-layout/category/${record.id}`)}
                            style={{ width: "45px", color: "#52c41a", borderColor: "#52c41a" }}
                        />
                    </Tooltip>
                </Space>
            ),
        }
    ];

    return (
        <>
            <PageModal open={modalVisible} handleCancel={handleCancel} update={update} />
            <div className="flex justify-between mb-5">
                <Search placeholder="Search category..." searchParamKey="search" onSearch={handleSearch} />
                <Button type="primary" className="btn" onClick={() => setModalVisible(true)}>Add Category</Button>
            </div>
            <GlobalTable
                data={categories}
                columns={columns}
                pagination={{
                    current: params.page,
                    pageSize: params.limit,
                    total: count,
                    showSizeChanger: true,
                    pageSizeOptions: ['2', '5', '7', '10'],
                }}
                onChange={handleTableChange}
            />
        </>
    );
};

export default Index;
