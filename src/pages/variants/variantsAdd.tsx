import api from "@/config/axios.customize";
import { IVariant } from "@/types/variants";
import { useQuery } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, message, Select, Row, Col } from "antd";
import { useNavigate } from "react-router";

const AddVariant = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();

  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/api/products");
      return res.data.data;
    },
  });

  const productOptions =
    products?.map((product: { name: string; _id: string }) => ({
      label: product.name,
      value: product._id,
    })) || [];

  const onFinish = async (values: IVariant) => {
    try {
      await api.post("/api/variants/add", values);
      message.success("Thêm biến thể thành công");
      nav("/variants");
    } catch (error: any) {
      message.error(error.response?.data?.message || "Thêm biến thể thất bại");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 700, margin: "0 auto" }}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Sản phẩm" name="productId" rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}>
            <Select placeholder="Chọn sản phẩm" options={productOptions} />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Màu sắc" name="color" rules={[{ required: true, message: "Vui lòng chọn màu sắc" }]}>
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
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Kích cỡ" name="size" rules={[{ required: true, message: "Vui lòng chọn kích cỡ" }]}>
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

        <Col span={12}>
          <Form.Item label="Kiểu dáng" name="fit" rules={[{ required: true, message: "Vui lòng chọn kiểu dáng" }]}>
            <Select
              placeholder="Chọn kiểu dáng"
              options={[
                { label: "Regular Fit", value: "Regular Fit" },
                { label: "Slim Fit", value: "Slim Fit" },
                { label: "Oversized", value: "Oversized" },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Chất liệu" name="material" rules={[{ required: true, message: "Vui lòng chọn chất liệu" }]}>
            <Select
              placeholder="Chọn chất liệu"
              options={[
                { label: "Cotton", value: "Cotton" },
                { label: "Denim", value: "Denim" },
                { label: "Kaki", value: "Kaki" },
                { label: "Linen", value: "Linen" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Tình trạng" name="status">
            <Select
              placeholder="Chọn tình trạng"
              options={[
                { label: "Còn hàng", value: "available" },
                { label: "Ngừng bán", value: "disabled" },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Giá tiền" name="price" rules={[{ required: true, message: "Vui lòng nhập giá tiền" }]}>
            <InputNumber min={0} style={{ width: "100%" }} placeholder="VD: 250000" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Tồn kho" name="stock_quantity" rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho" }]}>
            <InputNumber min={0} style={{ width: "100%" }} placeholder="VD: 100" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="SKU" name="sku" rules={[{ required: true, message: "Vui lòng nhập SKU" }]}>
            <Input placeholder="VD: AO-NAM-DEN-M" />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Ảnh biến thể (URL)" name="image_URL">
            <Input placeholder="URL ảnh minh họa (nếu có)" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Thêm biến thể
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddVariant;
