import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Descriptions, Table, Tag, Spin, Alert } from "antd";
import axios from "axios";
import { IOrder, IOrderItem } from "@/types/order";

const statusColors: Record<string, string> = {
  pending: "orange",
  confirmed: "blue",
  shipped: "cyan",
  delivered: "green",
  completed: "green",
  cancelled: "red",
  refunded: "purple",
};

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8888/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data.data);
    } catch (err) {
      setError("Không thể lấy dữ liệu đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrderDetail();
    else {
      setError("ID đơn hàng không hợp lệ");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Thông báo" description={error} type="error" showIcon style={{ marginTop: 20 }} />;
  }

  if (!order) {
    return <p>Không tìm thấy đơn hàng</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Chi tiết đơn hàng</h2>
      <Descriptions bordered column={3}>
        <Descriptions.Item label="Mã đơn hàng">{order._id}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "Không rõ"}</Descriptions.Item>
        <Descriptions.Item label="Tên khách hàng">{order.shippingInfo?.fullName || "Không có"}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{order.shippingInfo?.phone || "Không có"}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ giao hàng" span={2}>
          {order.shippingInfo?.address || "Không có"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái đơn">
          <Tag color={statusColors[order.status] || "default"}>{order.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Mã giảm giá">{order.couponId && typeof order.couponId !== "string" ? order.couponId.code : "Không áp dụng"}</Descriptions.Item>
        <Descriptions.Item label="Giảm giá">{(order.discountAmount || 0).toLocaleString()} ₫</Descriptions.Item>
        <Descriptions.Item label="Tổng cộng">{(order.totalAmount || 0).toLocaleString()} ₫</Descriptions.Item>
      </Descriptions>

      <h3 className="mt-8 mb-4 font-semibold text-lg">Sản phẩm trong đơn hàng</h3>
      <Table<IOrderItem>
        dataSource={order.orderItems}
        rowKey={(record) => record.productId}
        pagination={false}
        columns={[
          {
            title: "Tên sản phẩm",
            dataIndex: "name",
            render: (text) => text || "Không rõ",
          },
          {
            title: "Ảnh",
            dataIndex: "image",
            render: (src) => (src ? <img src={src} alt="Sản phẩm" style={{ width: 50 }} /> : "Không có"),
          },
          {
            title: "Giá",
            dataIndex: "price",
            render: (price) => `${(price || 0).toLocaleString()} ₫`,
          },
          { title: "Số lượng", dataIndex: "quantity" },
          {
            title: "Thành tiền",
            key: "total",
            render: (_: any, record: IOrderItem) =>
              order.totalAmount.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              }),
          },
        ]}
      />
    </div>
  );
};

export default OrderDetail;
