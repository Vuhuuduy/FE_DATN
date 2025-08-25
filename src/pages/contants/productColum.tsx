import { Button, message, Popconfirm, Space, Switch } from "antd";
import { Link } from "react-router";
import api from "@/config/axios.customize.ts";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { IProduct } from "../../types/product";

export const getProductColumns = (queryClient: any, DelProduct: (id: string) => void) => [
  {
    title: "ID",
    key: "id",
    render: (_: any, __: any, index: number) => index + 1,
  },
  {
    title: "Tên",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Mô tả",
    key: "description",
    render: (record: any) => record.description || record.descriptions || "",
  },
  {
    title: "Giá tiền",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Số lượng",
    dataIndex: "stock",
    key: "stock",
  },
  {
    title: "Danh mục",
    dataIndex: "category",
    key: "category",
    render: (category) => category?.name || "Không có",
  },
  {
    title: "Hình ảnh",
    key: "imageUrl",
    render: (record: IProduct) => <img src={record.imageUrl} alt="product" width={50} height={50} style={{ objectFit: "cover", borderRadius: 4 }} />,
  },

  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: string, record: IProduct) => {
      // ✅ nếu stock = 0 thì buộc về "Hết"
      const isOutOfStock = record.stock <= 0;
      const checked = !isOutOfStock && status === "Sẵn";

      return (
        <Switch
          checked={checked}
          checkedChildren="Sẵn"
          unCheckedChildren="Hết"
          style={{ minWidth: 50 }}
          disabled={isOutOfStock} // khóa nếu hết hàng
          onChange={async (checked) => {
            try {
              if (isOutOfStock) {
                message.warning("Sản phẩm hết hàng, không thể đổi trạng thái!");
                return;
              }

              await api.put(`/api/products/${record._id}`, {
                status: checked ? "Sẵn" : "Hết",
              });

              message.success("Cập nhật trạng thái thành công!");
              queryClient.invalidateQueries({ queryKey: ["products"] });
            } catch (error) {
              console.error(error);
              message.error("Cập nhật trạng thái thất bại!");
            }
          }}
        />
      );
    },
  },

  {
    title: "Hành động",
    key: "action",
    render: (_: any, record: IProduct) => (
      <Space>
        <Popconfirm title="Xoá sản phẩm này?" okText="Xoá" cancelText="Huỷ" onConfirm={() => DelProduct(record._id)}>
          <Button icon={<DeleteOutlined />} size="small" style={{ backgroundColor: "white", color: "red", borderColor: "red" }}></Button>
        </Popconfirm>
        <Link to={`/products/update/${record._id}`}>
          <Button icon={<EditOutlined />} size="small" style={{ backgroundColor: "white", color: "green", borderColor: "green" }}></Button>
        </Link>
      </Space>
    ),
  },
];
