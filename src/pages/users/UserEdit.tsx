import { App, Modal, Form, Input, Select, Tag } from "antd";
import { updateUser } from "@/apis/user";
import { useEffect } from "react";

const { Option } = Select;

export default function UserEdit({ open, onClose, user, onSuccess }: any) {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        fullname: user.fullname ?? "",
        email: user.email ?? "",
        phoneNumber: user.phoneNumber ?? "",
        city: user.city ?? "",
        isActive: !!user.isActive,
      });
    } else {
      form.resetFields();
    }
  }, [open, user, form]);

  const handleSubmit = async (values: any) => {
    if (!user?._id) {
      message.error("Không tìm thấy người dùng để cập nhật");
      return;
    }

    try {
      const payload = {
        fullname: values.fullname,
        phoneNumber: values.phoneNumber,
        address: [{ city: values.city, default: true }],
        isActive: !!values.isActive,
      };

      const res = await updateUser(user._id, payload);

      if (!values.isActive) {
        message.warning(`Tài khoản ${user.email} đã bị khóa .`);
      } else {
        message.success("Người dùng đã được cập nhật thành công");
      }

      // Nếu backend trả forceLogout thì xử lý đăng xuất ngay trên client hiện tại

      onClose();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      message.error("Có lỗi xảy ra khi lưu người dùng");
    }
  };

  return (
    <>
      {open && (
        <Modal open={true} onCancel={onClose} onOk={() => form.submit()} title="Cập nhật trạng thái người dùng" destroyOnClose>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="fullname" label="Họ tên">
              <Input disabled />
            </Form.Item>

            <Form.Item name="email" label="Email">
              <Input disabled />
            </Form.Item>

            <Form.Item name="phoneNumber" label="SĐT">
              <Input disabled />
            </Form.Item>

            <Form.Item name="city" label="Địa chỉ">
              <Input disabled />
            </Form.Item>

            <Form.Item name="isActive" label="Trạng thái" rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}>
              <Select>
                <Option value={true}>
                  <Tag color="green">Hoạt động</Tag>
                </Option>
                <Option value={false}>
                  <Tag color="red">Khóa</Tag>
                </Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
}
