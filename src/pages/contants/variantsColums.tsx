import { IVariant } from "@/types/variants";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Space } from "antd";
import { Link } from "react-router";

export const getVariantsColums = (queryClient: any, Del: (id: string) => void) => [
  {
    title: 'Tên sản phẩm',
    key: 'productId',
    render: (_: any, record: IVariant) => (
      <span>{typeof record.productId === 'string' ? record.productId : record.productId?.name}</span>
    ),
  },
  {
    title: 'SKU',
    dataIndex: 'sku',
    key: 'sku',
  },
  {
    title: 'Màu sắc',
    dataIndex: 'color',
    key: 'color',
  },
  {
    title: 'Kích cỡ',
    dataIndex: 'size',
    key: 'size',
  },
  {
    title: 'Giá (₫)',
    dataIndex: 'price',
    key: 'price',
    render: (value: number) => value.toLocaleString('vi-VN') + ' ₫'
  },
  {
    title: 'Tồn kho',
    dataIndex: 'stock_quantity',
    key: 'stock_quantity',
  },
  {
    title: 'Ảnh',
    dataIndex: 'image_URL',
    key: 'image_URL',
    render: (url?: string) => (
      url
        ? <img src={url} alt="variant" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }} />
        : 'Không có ảnh'
    )
  },
  {
    title: 'Hành động',
    key: 'action',
    render: (_: any, record: IVariant) => (
      <Space>
        <Link to={`/variants/${record._id}/edit`}>
          <Button icon={<EditOutlined />} size="small" />
        </Link>
        <Popconfirm
          title="Bạn có chắc chắn muốn xoá không?"
          onConfirm={() => Del(record._id)}
          okText="Xoá"
          cancelText="Huỷ"
        >
          <Button icon={<DeleteOutlined />} danger size="small" />
        </Popconfirm>
      </Space>
    ),
  }
];
