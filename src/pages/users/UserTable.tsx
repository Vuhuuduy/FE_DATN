import { Table, Button, Popconfirm, message, Tag } from "antd";
import { updateUser } from "@/apis/user";

type Props = {
  data: any[];
  onEdit: (user: any) => void;
  onReload: () => void;
};

export default function UserTable({ data, onEdit, onReload }: Props) {
  const handleToggleStatus = async (user: any) => {
    try {
      await updateUser(user._id, { isActive: !user.isActive });
      message.success("Cập nhật trạng thái thành công");
      onReload();
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  // Loại bỏ user trùng lặp theo _id
  const uniqueData = Array.from(new Map(data.map((item) => [item._id, item])).values());

  const columns = [
    { title: "Họ tên", dataIndex: "fullname" },
    { title: "Email", dataIndex: "email" },
    { title: "SĐT", dataIndex: "phoneNumber" },
    {
      title: "Địa chỉ",
      render: (_: any, record: any) => {
        const addressList = record.address;
        if (!Array.isArray(addressList) || addressList.length === 0) {
          return "Chưa cập nhật";
        }
        const defaultAddress = addressList.find((addr) => addr.default);
        return defaultAddress?.detail || "Chưa cập nhật";
      },
    },
    {
      title: "Ngày tạo",
      render: (_: any, record: any) => {
        const date = record.createdAt || record.date;
        return date ? new Date(date).toLocaleDateString("vi-VN") : "Không rõ";
      },
    },
    {
      title: "Trạng thái",
      render: (_: any, record: any) => {
        return <Tag color={record.isActive ? "green" : "red"}>{record.isActive ? "Hoạt động" : "Khóa"}</Tag>;
      },
    },
    {
      title: "Hành động",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button type="link" onClick={() => onEdit(record)}>
            Sửa
          </Button>
        </div>
      ),
    },
  ];

  return <Table dataSource={uniqueData} columns={columns} rowKey="_id" />;
}
