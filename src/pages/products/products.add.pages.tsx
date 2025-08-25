import { Button, Form, Input, message, Select, Row, Col, InputNumber, Upload, Divider } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import api from "@/config/axios.customize";
import { IProduct } from "../../types/product";

const ProductsAdd = () => {
  const nav = useNavigate();
  const [form] = Form.useForm<IProduct>();
  const { TextArea } = Input;
  const [image, setImage] = useState<string>(""); // ảnh chính preview
  const [loading, setLoading] = useState<boolean>(false);

  const colorOptions = ["Đỏ", "Xanh", "Vàng", "Trắng", "Đen"];
  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["active-categories"],
    queryFn: async () => {
      const res = await api.get("/api/categories/active");
      return res.data.data;
    },
  });

  // [FIX] upload chung trả về URL (secure_url)
  const handleUploadImage = async (file: File): Promise<string> => {
    if (!file) throw new Error("No file");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "reacttest"); // đổi preset nếu cần

    try {
      const { data } = await axios.post("https://api.cloudinary.com/v1_1/dkpfaleot/image/upload", formData);
      // Cloudinary trả secure_url
      return data.secure_url || data.url || "";
    } catch (error) {
      console.error("Tải hình ảnh lên thất bại:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ================== Submit form ==================
  const onFinish = async (values: any) => {
    // [FIX] Kiểm tra ảnh chính đã upload chưa (imageUrl lưu trong hidden field)
    const imageUrlFromForm = form.getFieldValue("imageUrl") || image;
    if (!imageUrlFromForm) {
      message.error("Vui lòng tải ảnh sản phẩm (ảnh chính).");
      return;
    }

    try {
      const sku = `${values.name}-${Date.now()}`;
      const productWithSKU = { ...values, sku, imageUrl: imageUrlFromForm };

      // gửi product chính
      const { data } = await api.post("/api/products/add", productWithSKU);

      // gửi variants sau khi có productId (nếu có)
      if (values.variants && values.variants.length > 0) {
        const productId = data.data._id;
        const promises = values.variants.map((variant: any) =>
          api.post("/api/variants/add", {
            ...variant,
            productId,
          })
        );
        await Promise.all(promises);
      }

      message.success("Thêm sản phẩm thành công!");
      nav("/products");
    } catch (err) {
      console.error(err);
      message.error("Thêm sản phẩm thất bại!");
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: 1000, margin: "0 auto" }}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Tên"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên sản phẩm" },
              { min: 3, message: "Tên sản phẩm chứa ít nhất 3 ký tự" },
            ]}
          >
            <Input placeholder="VD: Áo polo nam tay ngắn" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Danh mục" name="category" rules={[{ required: true, message: "Vui lòng chọn danh mục sản phẩm" }]}>
            <Select placeholder="-- Chọn --" loading={isLoadingCategories}>
              {categories?.map((cat: { _id: string; name: string }) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Giá tiền" name="price" rules={[{ required: true, message: "Vui lòng nhập giá tiền" }]}>
            <InputNumber placeholder="VD: 250000" style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Số lượng" name="stock" rules={[{ required: true, message: "Vui lòng nhập số lượng trong kho" }]}>
            <InputNumber placeholder="VD: 100" style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Trạng thái" name="status" initialValue="Sẵn">
            <Select>
              <Select.Option value="Sẵn">Sẵn</Select.Option>
              <Select.Option value="Hết">Hết</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        {/* [FIX] Bỏ name ở Form.Item wrap Upload để tránh AntD Upload bị truyền prop `value` -> Warning */}
        <Col span={12}>
          <Form.Item label="Ảnh">
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  message.error("Chỉ được tải lên hình ảnh!");
                }
                // return false to prevent default upload since we handle custom upload
                return isImage || Upload.LIST_IGNORE;
              }}
              customRequest={async ({ file, onSuccess, onError }) => {
                try {
                  if (file instanceof File) {
                    const url = await handleUploadImage(file);
                    setImage(url); // preview
                    // [FIX] lưu url vào form ẩn để validate / submit
                    form.setFieldsValue({ imageUrl: url });
                  }
                  setTimeout(() => onSuccess?.("ok"), 0);
                } catch (err) {
                  onError?.(err as any);
                  message.error("Upload ảnh thất bại");
                }
              }}
            >
              {loading ? (
                <div>
                  <LoadingOutlined />
                  <div style={{ marginTop: 8 }}>Đang tải...</div>
                </div>
              ) : image ? (
                <img src={image} alt="Uploaded" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải ảnh</div>
                </div>
              )}
            </Upload>

            {/* [FIX] hidden field lưu imageUrl (để form có giá trị imageUrl khi submit) */}
            <Form.Item name="imageUrl" style={{ display: "none" }}>
              <Input type="hidden" />
            </Form.Item>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Mô tả"
        name="description"
        rules={[
          { required: true, message: "Vui lòng nhập mô tả" },
          { min: 10, message: "Mô tả chứa ít nhất 10 ký tự" },
        ]}
      >
        <TextArea rows={4} placeholder="Mô tả chi tiết sản phẩm..." />
      </Form.Item>

      {/* ====================== VARIANTS ====================== */}
      <Form.List name="variants">
        {(fields, { add, remove }) => (
          <>
            <Divider orientation="left">Biến thể sản phẩm</Divider>
            {fields.map(({ key, name, ...restField }) => (
              <div
                key={key}
                style={{
                  border: "1px solid #eee",
                  padding: 16,
                  marginBottom: 12,
                  borderRadius: 8,
                }}
              >
                <Row gutter={16}>
                  {/* Màu sắc */}
                  <Col span={8}>
                    <Form.Item {...restField} label="Màu sắc" name={[name, "color"]} rules={[{ required: true, message: "Chọn màu" }]}>
                      <Select placeholder="Chọn màu" options={colorOptions.map((c) => ({ label: c, value: c }))} />
                    </Form.Item>
                  </Col>

                  {/* Size */}
                  <Col span={8}>
                    <Form.Item {...restField} label="Size" name={[name, "size"]} rules={[{ required: true, message: "Chọn size" }]}>
                      <Select placeholder="Chọn size" options={sizeOptions.map((s) => ({ label: s, value: s }))} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  {/* Giá */}
                  <Col span={8}>
                    <Form.Item {...restField} label="Giá" name={[name, "price"]} rules={[{ required: true, message: "Nhập giá" }]}>
                      <InputNumber style={{ width: "100%" }} min={0} />
                    </Form.Item>
                  </Col>

                  {/* Tồn kho */}
                  <Col span={8}>
                    <Form.Item {...restField} label="Tồn kho" name={[name, "stock_quantity"]} rules={[{ required: true, message: "Nhập số lượng" }]}>
                      <InputNumber style={{ width: "100%" }} min={0} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  {/* Ảnh biến thể */}
                  <Col span={8}>
                    <Form.Item label="Ảnh biến thể">
                      <Upload
                        listType="picture-card"
                        showUploadList={false}
                        beforeUpload={(file) => file.type.startsWith("image/") || Upload.LIST_IGNORE}
                        customRequest={async ({ file, onSuccess, onError }) => {
                          try {
                            if (file instanceof File) {
                              const url = await handleUploadImage(file);
                              const currentVariants = form.getFieldValue("variants") || [];
                              while (currentVariants.length <= name) currentVariants.push({});
                              currentVariants[name] = {
                                ...currentVariants[name],
                                image_URL: url,
                              };
                              form.setFieldsValue({ variants: currentVariants });
                            }
                            setTimeout(() => onSuccess?.("ok"), 0);
                          } catch (err) {
                            onError?.(err as any);
                            message.error("Upload ảnh biến thể thất bại");
                          }
                        }}
                      >
                        {form.getFieldValue(["variants", name, "image_URL"]) ? (
                          <img
                            src={form.getFieldValue(["variants", name, "image_URL"])}
                            alt="Variant"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: 8,
                            }}
                          />
                        ) : (
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Tải ảnh</div>
                          </div>
                        )}
                      </Upload>

                      {/* Hidden field lưu URL */}
                      <Form.Item name={[name, "image_URL"]} style={{ display: "none" }}>
                        <Input />
                      </Form.Item>
                    </Form.Item>
                  </Col>
                </Row>

                <Button type="default" onClick={() => remove(name)}>
                  Xóa biến thể
                </Button>
              </div>
            ))}

            <Form.Item>
              <Button type="dashed" onClick={() => add()} block>
                Thêm biến thể
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductsAdd;
