import { useEffect, useState } from "react";
import { Table, Space, Button, Popconfirm, Tag, message, Input } from "antd";
import { ColumnsType } from "antd/es/table";
import { IComment } from "@/types/comment";
import api from "@/config/axios.customize";

interface IReply {
  _id: string;
  userId: { _id: string; fullname: string };
  content: string;
  createdAt: string;
  parentCommentId: string;
  parentContent: string;   // nội dung comment gốc
  parentUser: string;      // tên user comment gốc
}

export default function CommentPage() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [replies, setReplies] = useState<IReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`api/comments?keyword=${keyword}`);
      const data = res.data.data || [];
      setComments(data);

      // gom replies thành list phẳng để quản lý
      const allReplies: IReply[] = [];
      data.forEach((c: IComment) => {
        c.replies?.forEach((r: any) => {
          allReplies.push({
            ...r,
            parentCommentId: c._id,
            parentContent: c.content,
            parentUser: c.userId?.fullname,
          });
        });
      });
      setReplies(allReplies);
    } catch (error) {
      message.error("Lỗi tải bình luận");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [keyword]);

  const handleDeleteComment = async (id: string) => {
    try {
      await api.delete(`api/comments/${id}`);
      message.success("Xóa bình luận thành công");
      fetchComments();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Không thể xóa bình luận");
    }
  };

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    try {
      await api.delete(`api/comments/${commentId}/replies/${replyId}`);
      message.success("Xóa trả lời thành công");
      fetchComments();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Không thể xóa trả lời");
    }
  };

  // Cột bình luận gốc
  const commentColumns: ColumnsType<IComment> = [
    { title: "Người dùng", dataIndex: ["userId", "fullname"] },
    { title: "Sản phẩm", dataIndex: ["productId", "name"] },
    { title: "Nội dung", dataIndex: "content" },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      render: (val: number) => <Tag color="gold">{val} ★</Tag>,
    },
    { title: "Hữu ích", dataIndex: "helpful" },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (val: string) => new Date(val).toLocaleString(),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Xóa bình luận này?"
            onConfirm={() => handleDeleteComment(record._id)}
          >
            <Button danger type="link">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Cột trả lời
  const replyColumns: ColumnsType<IReply> = [
    { title: "Người trả lời", dataIndex: ["userId", "fullname"] },
    { title: "Nội dung trả lời", dataIndex: "content" },
    {
      title: "Thuộc bình luận",
      render: (_, record) => (
        <span>
          <strong>{record.parentUser}:</strong> {record.parentContent}
        </span>
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Xóa trả lời này?"
            onConfirm={() =>
              handleDeleteReply(record.parentCommentId, record._id)
            }
          >
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
      <Input.Search
        placeholder="Tìm kiếm bình luận..."
        onSearch={(val) => setKeyword(val)}
        style={{ marginBottom: 16, maxWidth: 300 }}
      />

      {/* Bảng bình luận gốc */}
      <Table
        rowKey="_id"
        loading={loading}
        columns={commentColumns}
        dataSource={comments}
        title={() => "Danh sách bình luận gốc"}
        style={{ marginBottom: 40 }}
      />

      {/* Bảng trả lời */}
      <Table
        rowKey="_id"
        loading={loading}
        columns={replyColumns}
        dataSource={replies}
        title={() => "Danh sách trả lời"}
      />
    </div>
  );
}
