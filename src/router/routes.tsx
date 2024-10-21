import {
    ProductOutlined,
    AppstoreOutlined,
    AppstoreAddOutlined,
    SettingOutlined,
} from '@ant-design/icons';

const admin = [
    {
        content: "Products",
        path: "/admin-layout",
        icon: <ProductOutlined/>
    },
    {
        content: "Categories",
        path: "/admin-layout/category",
        icon: <AppstoreOutlined/>
    },
    {
        content: "Brands",
        path: "/admin-layout/brand",
        icon: <AppstoreOutlined/>
    },
    {
        content: "Brand category",
        path: "/admin-layout/brand-category",
        icon: <AppstoreAddOutlined/>
    },
    {
        content: "Settings",
        path: "/admin-layout/settings",
        icon: <SettingOutlined/>
    },
]

export { admin }