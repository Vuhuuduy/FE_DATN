import { Modal, Form, Input, message } from "antd";
import { IComment } from "@/types/comment";
import api from "@/config/axios.customize";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  comment: IComment | null;
  onSuccess: () => void;
}

export default function CommentUpdate({ open, onClose, comment, onSuccess }: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (comment) {
      form.setFieldsValue({
        content: comment.content,
      });
    }
  }, [comment]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await api.put(`/comments/${comment?._id}`, values);
      message.success("Cập nhật thành công");
      onSuccess();
      onClose();
    } catch {
      message.error("Không thể cập nhật");
    }
  };

  return (
    <Modal open={open} onCancel={onClose} onOk={handleOk} title="Chỉnh sửa bình luận">
      <Form form={form} layout="vertical">
        <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
