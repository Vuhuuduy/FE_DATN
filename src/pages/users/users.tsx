"use client";

import { useEffect, useState } from "react";
import { Card, Descriptions, Tag, Button, Modal, Form, Input, message } from "antd";
import { UserOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "@/config/axios.customize";

type AdminUser = {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber?: string;
  role: string;
  isActive: boolean;
};

export default function AdminUserPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const [formEdit] = Form.useForm();
  const [formPass] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      messageApi.error("Vui lòng đăng nhập!");
      nav("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== "admin") {
        messageApi.error("Bạn không có quyền truy cập!");
        nav("/login");
        return;
      }
      setUser(parsedUser);
    } catch {
      messageApi.error("Dữ liệu tài khoản bị lỗi!");
      nav("/login");
    }
  }, [nav, messageApi]);

  const handleEdit = () => {
    if (user) {
      formEdit.setFieldsValue({
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });
    }
    setOpenEdit(true);
  };

  const handleOkEdit = async () => {
    try {
      const values = await formEdit.validateFields();
      const res = await api.put(`/users/${user?._id}`, values);

      messageApi.success("Cập nhật thành công!");
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setOpenEdit(false);
    } catch (err: any) {
      messageApi.error(err.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  const handleOkPassword = async () => {
    try {
      const values = await formPass.validateFields();

      // lấy user từ localStorage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user._id) {
        messageApi.error("Không tìm thấy ID người dùng");
        return;
      }

      // gọi API đổi mật khẩu kèm id
      await api.put(`/users/${user._id}/change-password`, values);

      messageApi.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      localStorage.clear();
      nav("/login");
    } catch (err: any) {
      messageApi.error(err.response?.data?.message || "Đổi mật khẩu thất bại!");
    }
  };

  if (!user) {
    return (
      <>
        {contextHolder}
        <p className="text-center text-red-500 mt-10">Đang tải thông tin tài khoản...</p>
      </>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="p-6 max-w-3xl mx-auto">
        <Card
          title={
            <span className="flex items-center gap-2 text-xl">
              <UserOutlined />
              Thông tin tài khoản Admin
            </span>
          }
          extra={
            <>
              <Button icon={<EditOutlined />} onClick={handleEdit} style={{ marginRight: 8 }}>
                Sửa
              </Button>
              <Button icon={<LockOutlined />} onClick={() => setOpenPassword(true)}>
                Đổi mật khẩu
              </Button>
            </>
          }
          variant="borderless"
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Họ tên">{user.fullname || "Chưa có"}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{user.phoneNumber || "Chưa cập nhật"}</Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              <Tag color="red">{user.role}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Modal chỉnh sửa */}
        <Modal title="Chỉnh sửa thông tin" open={openEdit} onOk={handleOkEdit} onCancel={() => setOpenEdit(false)} okText="Lưu" cancelText="Hủy">
          <Form form={formEdit} layout="vertical">
            <Form.Item name="fullname" label="Họ tên" rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="phoneNumber" label="Số điện thoại">
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal đổi mật khẩu */}
        <Modal title="Đổi mật khẩu" open={openPassword} onOk={handleOkPassword} onCancel={() => setOpenPassword(false)} okText="Đổi" cancelText="Hủy">
          <Form form={formPass} layout="vertical">
            <Form.Item name="oldPassword" label="Mật khẩu cũ" rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item name="newPassword" label="Mật khẩu mới" rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}>
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}
