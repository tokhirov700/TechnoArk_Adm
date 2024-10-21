import { useState, useEffect } from 'react';
import { Button, Space, Tooltip } from "antd";
import { useGetBrand } from '../hooks/queries';
import { useDeleteBrand } from '../hooks/mutations';
import BrandModal from './modal';
import { GlobalTable, Search } from '@components';
import { EditFilled, CloseCircleFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from 'react-router-dom';
import { PaginationType } from '../types';

const BrandPage = () => {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigateTo = useNavigate();
  const [queryParams, setQueryParams] = useState({
    limit: 5,
    page: 1,
    search: ""
  });

  const { search: searchParams } = useLocation();
  const { data } = useGetBrand(queryParams);
  const { brands, count } = data || {};
  const { mutate: removeBrand } = useDeleteBrand();

  useEffect(() => {
    const searchParamsObj = new URLSearchParams(searchParams);
    setQueryParams({
      limit: Number(searchParamsObj.get("limit")) || 5,
      page: Number(searchParamsObj.get("page")) || 1,
      search: searchParamsObj.get("search_val") || ""
    });
  }, [searchParams]);

  const tableColumns = [
    {
      title: '№',
      dataIndex: 'index',
      key: 'index',
      render: (_text: string, _record: any, index: number) =>
        `${(queryParams.page - 1) * queryParams.limit + index + 1}`,
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
              onClick={() => openEditModal(record)}
              icon={<EditFilled />}
              style={{ width: "45px", color: "#1890ff", borderColor: "#1890ff" }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              onClick={() => removeBrandData(record.id)}
              style={{ width: "45px", color: "#ff4d4f", borderColor: "#ff4d4f" }}
              icon={<CloseCircleFilled />}
            />
          </Tooltip>
        </Space>
      ),
    }
  ];

  const openEditModal = (brand: any) => {
    setSelectedBrand(brand);
    setIsModalVisible(true);
  };

  const removeBrandData = (id: any) => {
    removeBrand(id);
  };

  const closeModal = () => {
    setSelectedBrand(null);
    setIsModalVisible(false);
  };

  const onSearch = (value: string) => {
    setQueryParams((prev) => ({ ...prev, search: value }));
  };

  const onTableChange = (pagination: PaginationType) => {
    const { pageSize, current } = pagination;
    setQueryParams((prev) => ({ ...prev, limit: pageSize, page: current }));

    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set("limit", `${pageSize}`);
    updatedParams.set("page", `${current}`);
    navigateTo(`?${updatedParams}`);
  };

  return (
    <div>
      <BrandModal open={isModalVisible} handleCancel={closeModal} update={selectedBrand} />
      <div className='flex justify-between mb-5'>
        <Search placeholder='Search brand...' onSearch={onSearch} searchParamKey={''} />
        <Button type='primary' onClick={() => setIsModalVisible(true)}>Add Brand</Button>
      </div>
      <GlobalTable
        data={brands}
        columns={tableColumns}
        pagination={{
          current: queryParams.page,
          pageSize: queryParams.limit,
          total: count,
          showSizeChanger: true,
          pageSizeOptions: ['2', '5', '7', '10'],
        }}
        onChange={onTableChange}
      />
    </div>
  );
};

export default BrandPage;
