import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, message, Upload, Divider, Spin, Row, Col, Select } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import api from "@/config/axios.customize";
import { IProduct } from "@/types/product";
import { IVariant } from "@/types/variants";

const ProductsUpdate = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const [image, setImage] = useState<string>("");
  const [variantImages, setVariantImages] = useState<string[]>([]);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [loadingVariantImage, setLoadingVariantImage] = useState<number | null>(null);
  const [loadingProduct, setLoadingProduct] = useState<boolean>(true);

  // Fetch product + variants
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await api.get(`/api/products/${id}`);
        const product: IProduct = productRes.data.data;

        const variantsRes = await api.get(`/api/variants/product/${id}`);

        const variants: IVariant[] = variantsRes.data.data || [];

        setImage(product.imageUrl || "");
        setVariantImages(variants.map((v) => v.image_URL || ""));

        form.setFieldsValue({
          ...product,
          stock: product.stock,
          variants,
        });
      } catch (err) {
        message.error("Lấy dữ liệu sản phẩm hoặc biến thể thất bại!");
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchData();
  }, [id, form]);

  // Upload ảnh product
  const uploadImage = async (file: File, cb: (url: string) => void) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "reacttest");
    try {
      const { data } = await axios.post("https://api.cloudinary.com/v1_1/dkpfaleot/image/upload", formData);
      cb(data.url);
    } catch (err) {
      message.error("Upload ảnh thất bại");
    }
  };

  // Upload ảnh chính
  const handleMainImageUpload = async (file: File) => {
    setLoadingImage(true);
    await uploadImage(file, (url) => {
      setImage(url);
      form.setFieldsValue({ imageUrl: url });
    });
    setLoadingImage(false);
  };

  // Upload ảnh variant
  const handleVariantImageUpload = async (index: number, file: File) => {
    setLoadingVariantImage(index);
    await uploadImage(file, (url) => {
      const newImages = [...variantImages];
      newImages[index] = url;
      setVariantImages(newImages);
      form.setFieldValue(["variants", index, "image_URL"], url);
    });
    setLoadingVariantImage(null);
  };

  // Submit form
  // Submit form
  const onFinish = async (values: IProduct & { variants?: IVariant[] }) => {
    try {
      const { variants, ...productData } = values;

      // Map variant về đúng schema backend
      const normalizedVariants = (variants || []).map((v) => ({
        name: `${v.color}-${v.size}`, // gộp color + size làm name
        additionalPrice: Number(v.price), // backend đang dùng additionalPrice
        stock: Number(v.stock_quantity), // rename đúng field
      }));

      // Chuẩn hóa product payload
      const payload = {
        ...productData,
        category: (values as any).category?._id || (values as any).category, // chỉ gửi id
        imageUrl: image,
        variants: normalizedVariants,
      };

      await api.put(`/api/products/${id}`, payload);

      // Update từng variant riêng (nếu bạn có bảng Variant tách riêng)
      if (variants && variants.length > 0) {
        await Promise.all(
          variants.map((variant) => {
            if (variant._id) {
              return api.put(`/api/variants/${variant._id}`, variant);
            }
            return null;
          })
        );
      }

      message.success("Cập nhật sản phẩm và biến thể thành công!");
      nav("/products");
    } catch (err) {
      console.error("Lỗi update:", err);
      message.error("Cập nhật thất bại!");
    }
  };

  if (loadingProduct) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" tip="Đang tải sản phẩm...">
          <div style={{ padding: 50 }} />
        </Spin>
      </div>
    );
  }

  return (
    <Form form={form} onFinish={onFinish} layout="vertical" style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Thông tin sản phẩm */}
      <Form.Item label="Tên" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Giá" name="price" rules={[{ required: true }]}>
        <InputNumber style={{ width: "100%" }} min={0} />
      </Form.Item>
    

      <Form.Item label="Ảnh">
        <Upload
          listType="picture-card"
          showUploadList={false}
          beforeUpload={(file) => file.type.startsWith("image/") || Upload.LIST_IGNORE}
          customRequest={({ file, onSuccess }) => {
            if (file instanceof File) handleMainImageUpload(file).then(() => onSuccess?.("ok"));
          }}
        >
          {loadingImage ? (
            <LoadingOutlined />
          ) : image ? (
            <img src={image} alt="Uploaded" style={{ width: "100%", objectFit: "cover" }} />
          ) : (
            <div>
              <PlusOutlined />
              <div>Tải ảnh</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item label="Mô tả" name="description">
        <TextArea rows={4} />
      </Form.Item>

      {/* Biến thể */}
      <Divider>Biến thể sản phẩm</Divider>

      <Form.List name="variants">
        {(fields) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <div
                key={key}
                style={{
                  border: "1px solid #eee",
                  padding: 16,
                  marginBottom: 16,
                  borderRadius: 8,
                  background: "#fafafa",
                }}
              >
                <Form.Item name={[name, "_id"]} hidden>
                  <Input type="hidden" />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item {...restField} name={[name, "color"]} label="Màu sắc" rules={[{ required: true, message: "Vui lòng chọn màu sắc" }]}>
                      <Select
                        placeholder="Chọn màu sắc"
                        options={[
                          { label: "Đen", value: "Đen" },
                          { label: "Trắng", value: "Trắng" },
                          { label: "Xám", value: "Xám" },
                          { label: "Xanh navy", value: "Xanh navy" },
                          { label: "Be", value: "Be" },
                        ]}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item {...restField} name={[name, "size"]} label="Kích cỡ" rules={[{ required: true, message: "Vui lòng chọn kích cỡ" }]}>
                      <Select
                        placeholder="Chọn kích cỡ"
                        options={[
                          { label: "XS", value: "XS" },
                          { label: "S", value: "S" },
                          { label: "M", value: "M" },
                          { label: "L", value: "L" },
                          { label: "XL", value: "XL" },
                          { label: "XXL", value: "XXL" },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item {...restField} name={[name, "price"]} label="Giá tiền" rules={[{ required: true, message: "Vui lòng nhập giá tiền" }]}>
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>

                  <Col span={12}>
                    <Form.Item {...restField} name={[name, "stock_quantity"]} label="Tồn kho" rules={[{ required: true, message: "Vui lòng nhập tồn kho" }]}>
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Upload ảnh biến thể */}
                <Form.Item label="Ảnh biến thể">
                  <Upload
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={(file) => file.type.startsWith("image/") || Upload.LIST_IGNORE}
                    customRequest={({ file, onSuccess }) => {
                      if (file instanceof File) handleVariantImageUpload(index, file).then(() => onSuccess?.("ok"));
                    }}
                  >
                    {loadingVariantImage === index ? (
                      <LoadingOutlined />
                    ) : variantImages[index] ? (
                      <img
                        src={variantImages[index]}
                        alt="Variant"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div>
                        <PlusOutlined />
                        <div>Tải ảnh</div>
                      </div>
                    )}
                  </Upload>
                </Form.Item>
              </div>
            ))}
          </>
        )}
      </Form.List>

      <Form.Item style={{ marginTop: 20 }}>
        <Button type="primary" htmlType="submit" block>
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ProductsUpdate;
