import { useForm } from "antd/lib/form/Form";
import { CategoryType } from "../types";
import { useCreateCategory, useUpdateCategory } from "../hooks/mutation";
import { Button, Form, Input, Modal } from "antd";
import { useEffect } from "react";
import { ModalPropType } from "@types";

const CategoryModalForm = ({ open, handleCancel, update }: ModalPropType) => {
    const [form] = useForm();
    const { mutate: createCategory, isPending: isCreatingCategory } = useCreateCategory();
    const { mutate: updateCategory, isPending: isUpdatingCategory } = useUpdateCategory();

    useEffect(() => {
        if (open) {
            if (update) {
                form.setFieldsValue({
                    name: update.name,
                });
            } else {
                form.resetFields();
            }
        }
    }, [open, update, form]);

    const handleFormSubmit = (values: CategoryType) => {
        if (update) {
            const updatePayload = { ...values, id: update?.id };
            updateCategory(updatePayload, {
                onSuccess: () => {
                    handleCancel();
                }
            });
        } else {
            createCategory(values, {
                onSuccess: () => {
                    handleCancel();
                }
            });
        }
    };

    return (
        <Modal
            open={open}
            title={update?.id ? "Edit Category" : "Create Category"}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                name="categoryForm"
                style={{ width: "100%", marginTop: "20px" }}
                onFinish={handleFormSubmit}
                layout="vertical"
            >
                <Form.Item
                    label="Category Name"
                    name="name"
                    rules={[{ required: true, message: "Enter category name" }]}
                >
                    <Input size="large" />
                </Form.Item>
                <Form.Item>
                    <Button
                        size="large"
                        style={{ width: "100%" }}
                        type="primary"
                        htmlType="submit"
                        loading={isCreatingCategory || isUpdatingCategory}
                    >
                        {update ? "Update" : "Add"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryModalForm;
