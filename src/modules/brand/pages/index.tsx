import { useState, useEffect } from 'react';
import { Button, Space, Tooltip } from "antd";
import { EditFilled, CloseCircleFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetBrand } from '../hooks/queries';
import { useDeleteBrand } from '../hooks/mutations';
import { ColumnsType } from '@types';
import BrandModal from './modal';
import { GlobalTable, Search, ConfirmDelete } from '@components';
import { PaginationType } from '../types';

const Index = () => {
    const [update, setUpdate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();
    const [params, setParams] = useState({
        limit: 5,
        page: 1,
        search: ""
    });
    const { search } = useLocation();
    const { data } = useGetBrand(params);
    const { brands, count } = data || {};
    const { mutate: deleteBrand } = useDeleteBrand();

    useEffect(() => {
        const params = new URLSearchParams(search);
        const page = Number(params.get("page")) || 1;
        const limit = Number(params.get("limit")) || 5;
        const search_val = params.get("seatch_val") || "";
        setParams((prev) => ({
            ...prev,
            search: search_val,
            limit: limit,
            page: page
        }));
    }, [search]);

    const columns = [
        {
            title: '№',
            dataIndex: 'index',
            key: 'index',
            render: (_text: string, _record: any, index: number) => `${(params.page - 1) * params.limit + index + 1}`,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
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
                        title="Delete brand?"
                        description="Are you sure to delete this brand?"
                        onConfirm={() => deleteData(record.id)}
                    >
                        <Tooltip title="Delete">
                            <Button style={{ width: "45px", color: "#ff4d4f", borderColor: "#ff4d4f" }}>
                                <CloseCircleFilled />
                            </Button>
                        </Tooltip>
                    </ConfirmDelete>
                </Space>
            ),
        }
    ];

    const editData = (data: any) => {
        setUpdate(data);
        setModalVisible(true);
    };
    
    const deleteData = (id: any) => {
        deleteBrand(id);
    };
    
    const handleCancel = () => {
        setUpdate(null);
        setModalVisible(false);
    };
    
    const handleSearch = (value: string) => {
        setParams((prev) => ({
            ...prev,
            search: value
        }));
    };
    
    const handleTableChange = (pagination: PaginationType) => {
        const { pageSize, current } = pagination;
        setParams((prev) => ({
            ...prev,
            limit: pageSize,
            page: current
        }));
        const current_params = new URLSearchParams(search);
        current_params.set("limit", `${pageSize}`);
        current_params.set("page", `${current}`);
        navigate(`?${current_params}`);
    };

    return (
        <div>
            <BrandModal open={modalVisible} handleCancel={handleCancel} update={update}/>
            <div className='flex justify-between mb-5'>
                <Search placeholder='Search brand...' searchParamKey='search' onSearch={handleSearch}/>
                <Button type='primary' className='btn' onClick={() => setModalVisible(true)}>Add Brand</Button>
            </div>
            <GlobalTable
                data={brands}
                columns={columns}
                pagination={{
                    current: params.page,
                    pageSize: params.limit,
                    total: count,
                    showSizeChanger: true,
                    pageSizeOptions: ['2', '5', '7', '10']
                }}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default Index;
