import { Table, Tag, Space, Typography, Dropdown, Button, Tooltip, App } from "antd";
import { EyeOutlined, DownOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { IOrder } from "@/types/order";
import { getStatusTagColor, ORDER_STATUS, ORDER_STATUS_FLOW, getPaymentStatusTagColor } from "./ordersContant";
import { useNavigate } from "react-router";

const { Text } = Typography;

// ✅ Thêm list trạng thái thanh toán
const PAYMENT_STATUS = [
  { key: "Đã thanh toán", label: "Đã thanh toán" },
  { key: "Chưa thanh toán", label: "Chưa thanh toán" },
];

const fetchOrders = async (): Promise<IOrder[]> => {
  const token = localStorage.getItem("token");
  const res = await axios.get("http://localhost:8888/api/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const OrderList = () => {
  const nav = useNavigate();
  const { message } = App.useApp();

  const { data, isLoading, error, refetch } = useQuery<IOrder[]>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  const getStatusLabel = (statusKey: string) => {
    const status = ORDER_STATUS.find((s) => s.key === statusKey);
    return status ? status.label : statusKey;
  };

  // ✅ Ép cứng trạng thái thanh toán ở frontend
  const getPaymentStatus = (record: IOrder) => {
    const method = record.paymentMethod?.toLowerCase();

    if (["momo", "vnpay", "paypal"].includes(method)) {
      return "Đã thanh toán";
    }
    if (method === "cod") {
      return record.status === "Đã hoàn thành" ? "Đã thanh toán" : "Chưa thanh toán";
    }
    return "Chưa thanh toán";
  };

  const handleChangeStatus = async (record: IOrder, statusKey: string, label: string) => {
    // ====== VALIDATE ======
    if (statusKey === "Đã hủy") {
      if (!["Chờ xác nhận", "Đã xác nhận"].includes(record.status)) {
        message.warning("Chỉ có thể hủy đơn khi đang ở 'Chờ xác nhận' hoặc 'Đã xác nhận'");
        return;
      }
    }

    const reason =
      statusKey === "Đã hủy"
        ? "Huỷ bởi admin"
        : // : statusKey === "Đã hoàn tiền"
          // ? "Hoàn tiền bởi admin"
          undefined;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8888/api/orders/${record._id}`,
        { status: statusKey, reason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success(`Đã cập nhật trạng thái: ${label}`);
      refetch();
    } catch (err) {
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  const columns = [
    {
      title: "Người đặt",
      key: "user",
      render: (_: any, record: IOrder) => (
        <div>
          <Text strong>{record.userId?.fullname}</Text>
          <br />
          <Text type="secondary">{record.userId?.email}</Text>
        </div>
      ),
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "_id",
      key: "orderId",
      render: (value?: string) => (value ? `#${value.slice(-6)}` : ""),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (value?: number) =>
        (value ?? 0).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (value: string) => {
        switch (value) {
          case "cod":
            return "COD";
          case "momo":
            return "Momo";
          case "vnpay":
            return "VNPAY";
          case "paypal":
            return "PayPal";
          default:
            return value || "Không xác định";
        }
      },
    },
    // ✅ Cột mới: Trạng thái thanh toán (ép từ frontend)
    {
      title: "Trạng thái thanh toán",
      key: "paymentStatus",
      render: (_: any, record: IOrder) => {
        const value = getPaymentStatus(record);
        const status = PAYMENT_STATUS.find((s) => s.key === value);
        return <Tag color={getPaymentStatusTagColor(value)}>{status ? status.label : value}</Tag>;
      },
    },
    {
      title: "Lý do hủy",
      key: "cancelReason",
      render: (_: any, record: IOrder) => (record.status === "Đã hủy" ? <Text type="danger">{record.cancelReason || "Không có"}</Text> : "-"),
    },

    {
      title: "Trạng thái",
      key: "status",
      render: (_: any, record: IOrder) => <Tag color={getStatusTagColor(record.status)}>{getStatusLabel(record.status)}</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: IOrder) => {
        const currentIndex = ORDER_STATUS_FLOW.indexOf(record.status);

        const menuItems = ORDER_STATUS.filter((status) => {
          const newIndex = ORDER_STATUS_FLOW.indexOf(status.key);
          const isCancelled = status.key === "Đã hủy";
          // const isRefunded = status.key === "Đã hoàn tiền";
          const canCancel = ["Chờ xác nhận", "Đã xác nhận"].includes(record.status);

          // 🚫 Chỉ cho phép chọn trạng thái liền kề tiếp theo
          const isNextStep = newIndex === currentIndex + 1;

          // ✅ Quy tắc cho hủy và hoàn tiền
          if (isCancelled && canCancel) return true;
          if (record.status === "Đã giao hàng") return true;

          return isNextStep;
        }).map((status) => ({
          key: status.key,
          label: status.label,
          onClick: () => handleChangeStatus(record, status.key, status.label),
        }));

        return (
          <Space size="middle">
            <Tooltip title="Xem chi tiết">
              <Button icon={<EyeOutlined />} onClick={() => nav(`/orders/${record._id}`)} />
            </Tooltip>
            {menuItems.length > 0 && (
              <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
                <Tooltip title="Thay đổi trạng thái">
                  <Button icon={<DownOutlined />} />
                </Tooltip>
              </Dropdown>
            )}
          </Space>
        );
      },
    },
  ];

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi khi tải đơn hàng</p>;

  return <Table rowKey="_id" dataSource={[...(data ?? [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} columns={columns} pagination={{ pageSize: 5 }} />;
};

export default OrderList;
