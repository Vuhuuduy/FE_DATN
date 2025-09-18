import { useEffect, useState } from "react"
import {
  Table,
  Space,
  Button,
  Tag,
  message,
  Popconfirm,
  Modal,
  Select,
  Input,
  Badge,
  Form,
} from "antd"
import {
  EyeOutlined,
  DeleteOutlined,
  ReloadOutlined,
  MailOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"
import api from "@/config/axios.customize"

export interface IContact {
  _id: string
  name: string
  email: string
  message: string
  status: "pending" | "read" | "replied"
  createdAt: string
  replies?: string[]
}

export default function ContactPage() {
  const [contacts, setContacts] = useState<IContact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<IContact[]>([])
  const [loading, setLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>()
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [detail, setDetail] = useState<IContact | null>(null)
  const [replyModal, setReplyModal] = useState(false)
  const [replyForm] = Form.useForm()

  // fetch contacts
  const fetchContacts = async () => {
    setLoading(true)
    try {
      const res = await api.get("/api/contact")
      const data: IContact[] = Array.isArray(res.data)
        ? res.data
        : res.data.contacts || []
      setContacts(data)
      setFilteredContacts(data)
    } catch {
      message.error("Lỗi khi tải liên hệ")
      setContacts([])
      setFilteredContacts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  // delete
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/contact/${id}`)
      message.success("Đã xóa liên hệ")
      fetchContacts()
    } catch {
      message.error("Xóa thất bại")
    }
  }

  // update status
  const handleStatusChange = async (id: string, status: IContact["status"]) => {
    try {
      await api.patch(`/api/contact/${id}`, { status })
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c))
      )
      if (detail?._id === id) setDetail({ ...detail, status })
    } catch {
      message.error("Cập nhật trạng thái thất bại")
    }
  }

  // bulk update
  const handleBulkUpdate = async (status: IContact["status"]) => {
    try {
      await Promise.all(
        selectedRowKeys.map((id) =>
          api.patch(`/api/contact/${id}`, { status })
        )
      )
      setContacts((prev) =>
        prev.map((c) =>
          selectedRowKeys.includes(c._id) ? { ...c, status } : c
        )
      )
      setSelectedRowKeys([])
      message.success("Đã cập nhật trạng thái hàng loạt")
    } catch {
      message.error("Lỗi bulk update")
    }
  }

  // reply
  const handleReply = async (values: { reply: string }) => {
    if (!detail) return
    try {
      const res = await api.post(`/api/contact/${detail._id}/reply`, {
        replyMessage: values.reply,
      })

      // BE trả contact đã update (nên có replies mới)
      const updated: IContact = res.data?.contact || {
        ...detail,
        status: "replied",
        replies: [...(detail.replies || []), values.reply],
      }

      // update danh sách
      setContacts((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      )
      setDetail(updated)

      message.success("Đã phản hồi khách hàng")
      setReplyModal(false)
      replyForm.resetFields()
    } catch {
      message.error("Phản hồi thất bại")
    }
  }

  // filter status
  useEffect(() => {
    if (filterStatus) {
      setFilteredContacts(contacts.filter((c) => c.status === filterStatus))
    } else {
      setFilteredContacts(contacts)
    }
  }, [filterStatus, contacts])

  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Nội dung",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: IContact["status"]) => {
        const color =
          status === "pending" ? "orange" : status === "read" ? "blue" : "green"
        const text =
          status === "pending"
            ? "Chưa xử lý"
            : status === "read"
            ? "Đã đọc"
            : "Đã phản hồi"
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val: string) => new Date(val).toLocaleString(),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: IContact) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setDetail(record)
              if (record.status === "pending")
                handleStatusChange(record._id, "read")
            }}
          />
          <Button
            icon={<MailOutlined />}
            onClick={() => {
              setDetail(record)
              setReplyModal(true)
            }}
          />
          <Popconfirm
            title="Xóa liên hệ này?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      {/* Action bar */}
      <div className="flex gap-4 mb-4">
        <Badge>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchContacts}
            loading={loading}
          >
            Làm mới
          </Button>
        </Badge>

        <Select
          allowClear
          placeholder="Lọc trạng thái"
          style={{ width: 200 }}
          onChange={(val) => setFilterStatus(val)}
        >
          <Select.Option value="pending">Chưa xử lý</Select.Option>
          <Select.Option value="read">Đã đọc</Select.Option>
          <Select.Option value="replied">Đã phản hồi</Select.Option>
        </Select>

        <Input.Search
          placeholder="Tìm theo tên hoặc email"
          allowClear
          onSearch={(val) => {
            const keyword = val.toLowerCase()
            setFilteredContacts(
              contacts.filter(
                (c) =>
                  c.name.toLowerCase().includes(keyword) ||
                  c.email.toLowerCase().includes(keyword)
              )
            )
          }}
          style={{ width: 250 }}
        />

        {selectedRowKeys.length > 0 && (
          <Space>
            <Button
              icon={<CheckCircleOutlined />}
              onClick={() => handleBulkUpdate("read")}
            >
              Đánh dấu đã đọc
            </Button>
            <Button
              icon={<MailOutlined />}
              onClick={() => handleBulkUpdate("replied")}
            >
              Đánh dấu đã phản hồi
            </Button>
          </Space>
        )}
      </div>

      {/* Table */}
      <Table
        rowKey="_id"
        loading={loading}
        columns={columns}
        dataSource={filteredContacts}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
      />

      {/* Modal chi tiết */}
      <Modal
        open={!!detail}
        title="Chi tiết liên hệ"
        footer={null}
        onCancel={() => setDetail(null)}
      >
        {detail && (
          <div>
            <p>
              <b>Tên:</b> {detail.name}
            </p>
            <p>
              <b>Email:</b> {detail.email}
            </p>
            <p>
              <b>Nội dung:</b> {detail.message}
            </p>
            <p>
              <b>Ngày tạo:</b>{" "}
              {new Date(detail.createdAt).toLocaleString()}
            </p>
            {detail.replies && detail.replies.length > 0 && (
              <div>
                <b>Các phản hồi:</b>
                <ul>
                  {detail.replies.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal phản hồi */}
      <Modal
        open={replyModal}
        title="Phản hồi khách hàng"
        onCancel={() => setReplyModal(false)}
        onOk={() => replyForm.submit()}
      >
        <Form form={replyForm} onFinish={handleReply}>
          <Form.Item
            name="reply"
            rules={[{ required: true, message: "Vui lòng nhập phản hồi" }]}
          >
            <Input.TextArea rows={4} placeholder="Nhập nội dung phản hồi..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
