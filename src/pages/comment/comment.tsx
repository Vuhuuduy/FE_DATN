import { useEffect, useState } from "react";
import { Table, Space, Button, Popconfirm, Tag, message, Input } from "antd";
import { ColumnsType } from "antd/es/table";
import { IComment } from "@/types/comment";
import api from "@/config/axios.customize";

export default function CommentPage() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`api/comments?keyword=${keyword}`);
      setComments(res.data.data || []);
    } catch (error) {
      message.error("Lỗi tải bình luận");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [keyword]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`api/comments/${id}`);
      message.success("Xóa bình luận thành công");
      fetchComments();
    } catch (error: any) {
      console.error(error);
      message.error(error.response?.data?.message || "Không thể xóa bình luận");
    }
  };

  const columns: ColumnsType<IComment> = [
    {
      title: "Người dùng",
      dataIndex: ["userId", "fullname"],
    },
    {
      title: "Sản phẩm",
      dataIndex: ["productId", "name"],
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      render: (val: string, record) => <span style={{ color: record.isHidden ? "gray" : "inherit" }}>{val}</span>,
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      render: (val: number) => <Tag color="gold">{val} ★</Tag>,
    },
    {
      title: "Hữu ích",
      dataIndex: "helpful",
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (val: string) => new Date(val).toLocaleString(),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Popconfirm title="Xóa bình luận này?" onConfirm={() => handleDelete(record._id)}>
            <Button danger type="link">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-xl mb-4">Quản lý bình luận</h2>
      <Input.Search placeholder="Tìm kiếm bình luận..." onSearch={(val) => setKeyword(val)} style={{ marginBottom: 16, maxWidth: 300 }} />
      <Table rowKey="_id" loading={loading} columns={columns} dataSource={comments} />
    </div>
  );
}
