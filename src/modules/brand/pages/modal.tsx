import { useForm } from "antd/lib/form/Form";
import { BrandType } from "../types";
import { useEffect, useState } from "react";
import { ModalPropType } from "@types";
import { useCreateBrand, useUpdateBrand } from "../hooks/mutations";
import { Button, Form, Input, Modal, Select } from "antd";
import { Upload } from "@components";
import { useGetCategory } from "../../category/hooks/queries";

const { TextArea } = Input;
const { Option } = Select;

const BrandModalForm = ({ open, handleCancel, update }: ModalPropType) => {
  const [uploadedFile, setUploadedFile] = useState<unknown>(null);
  const [form] = useForm();
  const { categories } = useGetCategory({})?.data || {};
  const { mutate: createBrand, isPending: isCreatingBrand } = useCreateBrand();
  const { mutate: updateBrand, isPending: isUpdatingBrand } = useUpdateBrand();

  useEffect(() => {
    if (open) {
      if (update) {
        form.setFieldsValue({
          name: update.name,
          description: update.description,
          category_id: update.category_id,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, update, form]);

  const handleFormSubmit = async (values: BrandType) => {
    const selectedFile = uploadedFile?.originFileObj || uploadedFile;
    console.log("salom");
    
    // if (!selectedFile) {
    //   form.setFields([
    //     {
    //       name: "file",
    //       errors: ["Upload a file"],
    //     },
    //   ]);
    //   return;
    // }
    // console.log("salom")

    const formData = new FormData();
    formData.append("description", values.description);
    formData.append("name", values.name);
    if (values.category_id) {
      formData.append("category_id", values.category_id);
    }
    formData.append("file", selectedFile);
    
    if (update) {
      const updatePayload = { ...values, id: update.id, categoryId: values.category_id };
      updateBrand(updatePayload, {
        onSuccess: () => {
          handleCancel();
        },
      });
    } else {
      createBrand(formData, {
        onSuccess: () => {
          handleCancel();
        },
      });
    }
  };

  return (
    <Modal
      open={open}
      title={update?.id ? "Edit Brand" : "Create Brand"}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        name="brandForm"
        style={{ width: "100%", marginTop: "20px" }}
        onFinish={handleFormSubmit}
        layout="vertical"
      >
        <Form.Item
          label="Brand Name"
          name="name"
          rules={[{ required: true, message: "Enter brand name" }]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category_id"
          rules={[{ required: true, message: "Select a category" }]}
        >
          <Select placeholder="Select a category" size="large">
            {categories?.map((category: any) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {!update && (
          <Form.Item
            label="Brand logo"
            name="file"
            rules={[
              {
                required: true,
                validator: () =>
                  uploadedFile
                    ? Promise.resolve()
                    : Promise.reject("Please upload a file"),
              },
            ]}
          >
            <Upload setFile={setUploadedFile} />
          </Form.Item>
        )}

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Enter description" }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button
            size="large"
            style={{ width: "100%" }}
            type="primary"
            htmlType="submit"
            loading={isCreatingBrand || isUpdatingBrand}
          >
            {update ? "Update" : "Add"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BrandModalForm;
