import { useEffect, useState } from "react";
import {
  Table,
  Space,
  Button,
  Popconfirm,
  Tag,
  message,
  Input,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { IComment, IReply } from "@/types/comment";
import api from "@/config/axios.customize";

export default function CommentPage() {
  const [comments, setComments] = useState<IComment[]>([]);
  const [replies, setReplies] = useState<IReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`api/comments?keyword=${keyword}`);
      const data: IComment[] = res.data.data || [];
      setComments(data);

      // Gom tất cả replies thành mảng phẳng
      const allReplies: IReply[] = [];
      data.forEach((c) => {
        c.replies?.forEach((r) => {
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
      message.error("Lỗi tải đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [keyword]);

  // Toggle ẩn/hiện comment
  const toggleHideComment = async (id: string, isHidden: boolean) => {
    try {
      await api.patch(`api/comments/${id}`, { isHidden: !isHidden });
      message.success(isHidden ? "Đã hiển thị lại đánh giá" : "Đã ẩn đánh giá");
      fetchComments();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Không thể cập nhật trạng thái");
    }
  };

  // Toggle ẩn/hiện reply
  const toggleHideReply = async (commentId: string, replyId: string, isHidden: boolean) => {
    try {
      await api.patch(`api/comments/${commentId}/replies/${replyId}`, { isHidden: !isHidden });
      message.success(isHidden ? "Đã hiển thị lại bình luận" : "Đã ẩn bình luận");
      fetchComments();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Không thể cập nhật trạng thái");
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
      title: "Trạng thái",
      dataIndex: "isHidden",
      render: (val: boolean) =>
        val ? <Tag color="red">Đã ẩn</Tag> : <Tag color="green">Hiển thị</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (val: string) => new Date(val).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title={record.isHidden ? "Hiện lại bình luận này?" : "Ẩn bình luận này?"}
            onConfirm={() => toggleHideComment(record._id, record.isHidden)}
          >
            <Button type="link">
              {record.isHidden ? "Hiện" : "Ẩn"}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Cột trả lời
  const replyColumns: ColumnsType<IReply> = [
    { title: "Người bình luận", dataIndex: ["userId", "fullname"] },
    { title: "Nội dung bình luận", dataIndex: "content" },
    {
      title: "Thuộc đánh giá / trả lời",
      render: (_, record) => {
        if (record.replyTo) {
          return (
            <span>
              Trả lời <strong>{record.replyTo.userId.fullname}</strong>:{" "}
              {record.replyTo.content}
            </span>
          );
        }
        return (
          <span>
            Trả lời <strong>{record.parentUser}</strong>: {record.parentContent}
          </span>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "isHidden",
      render: (val: boolean) =>
        val ? <Tag color="red">Đã ẩn</Tag> : <Tag color="green">Hiển thị</Tag>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (val: string) => new Date(val).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title={record.isHidden ? "Hiện lại trả lời này?" : "Ẩn trả lời này?"}
            onConfirm={() =>
              toggleHideReply(record.parentCommentId!, record._id, record.isHidden)
            }
          >
            <Button type="link">
              {record.isHidden ? "Hiện" : "Ẩn"}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-xl mb-4">Quản lý bình luận</h2>

      {/* Thanh tìm kiếm */}
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm bình luận..."
          prefix={<SearchOutlined />}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          allowClear
          style={{ width: 300 }}
        />
      </div>

      {/* Bảng bình luận gốc */}
      <Table
        rowKey="_id"
        loading={loading}
        columns={commentColumns}
        dataSource={comments}
        title={() => "Danh sách đánh giá"}
        style={{ marginBottom: 40 }}
      />

      {/* Bảng trả lời */}
      <Table
        rowKey="_id"
        loading={loading}
        columns={replyColumns}
        dataSource={replies}
        title={() => "Danh sách bình luận"}
      />
    </div>
  );
}
