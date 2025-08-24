import { Button, message, Popconfirm, Space, Switch } from "antd";
import { Link } from "react-router-dom";
import api from "@/config/axios.customize";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { IDiscounts } from "@/types/discounts";
import dayjs from "dayjs";

export const getDiscountsColumns = (queryClient: any, Del: (id: string) => void) => [
  {
    title: "ID",
    key: "id",
    render: (_: any, __: any, index: number) => index + 1,
  },
  {
    title: "Mã khuyến mãi",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "Phân loại",
    dataIndex: "discount_type",
    key: "discount_type",
    render: (type: string) => (type === "%" ? "Phần trăm" : "Tiền mặt"),
  },
  {
    title: "Giá trị",
    dataIndex: "discount_value",
    key: "discount_value",
    render: (_: unknown, record: IDiscounts) => {
      const value = record.discount_value;
      const type = record.discount_type;

      if (type === "%") {
        return typeof value === "number" ? `${value}%` : "0%";
      }

      return typeof value === "number" ? `${value.toLocaleString()} ₫` : "0 ₫";
    },
  },
  {
    title: "Đơn hàng tối thiểu",
    dataIndex: "minOrderValue",
    key: "minOrderValue",
    render: (value?: number) => (typeof value === "number" ? `${value.toLocaleString()} ₫` : "--"),
  },
  {
    title: "Thời gian áp dụng",
    key: "date",
    render: (_: any, record: IDiscounts) => {
      if (Array.isArray(record.date) && record.date.length >= 2) {
        const start = dayjs(record.date[0]).format("DD/MM/YYYY");
        const end = dayjs(record.date[1]).format("DD/MM/YYYY");
        return `${start} - ${end}`;
      }
      return "--";
    },
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: string, record: IDiscounts) => (
      <Switch
        checked={status === "active"}
        checkedChildren="Mở"
        unCheckedChildren="Khoá"
        onChange={async (checked) => {
          try {
            await api.put(`api/discounts/${record._id!}`, {
              status: checked ? "active" : "inactive",
            });
            message.success("Cập nhật trạng thái thành công!");
            queryClient.invalidateQueries({ queryKey: ["discounts"] });
          } catch (error) {
            console.error("Lỗi cập nhật trạng thái:", error);
            message.error("Cập nhật thất bại");
          }
        }}
      />
    ),
  },
  {
    title: "Hành động",
    key: "actions",
    render: (_: any, record: IDiscounts) => (
      <Space>
        <Popconfirm title="Xoá khuyến mãi này?" okText="Xoá" cancelText="Huỷ" onConfirm={() => Del(record._id!)}>
          <Button
            icon={<DeleteOutlined />}
            size="small"
            style={{
              backgroundColor: "white",
              color: "red",
              borderColor: "red",
            }}
          />
        </Popconfirm>
        <Link to={`/discounts/update/${record._id}`}>
          <Button
            icon={<EditOutlined />}
            size="small"
            style={{
              backgroundColor: "white",
              color: "green",
              borderColor: "green",
            }}
          />
        </Link>
      </Space>
    ),
  },
];
