"use client";

import { Card, Col, Row, Statistic, Typography, Space } from "antd";
import { Line, Column, Pie, Bar } from "@ant-design/plots";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "@/apis/user";
import { getStats } from "@/apis/stats";
import StockTable from "@/pages/analytics/StockTable";
import DailyStatistics from "@/pages/analytics/DailyStatistics";
import TopProductsTable from "@/pages/analytics/TopProductsTable";

import { ShoppingCartOutlined, DollarOutlined, UserOutlined, InboxOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Title } = Typography;

export default function Analytics() {
  const navigate = useNavigate();

  const [revenue, setRevenue] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([getStats(), getAllUsers()]);

        setRevenue(statsRes.totalRevenue || 0);
        setTotalOrders(statsRes.totalOrders || 0);

        const users = Array.isArray(usersRes) ? usersRes : [];
        const normalUsers = users.filter((u: any) => u.role === "user");
        setTotalCustomers(normalUsers.length);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu thống kê:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  const revenueData = [
    { month: "Jan", value: 5000000 },
    { month: "Feb", value: 8000000 },
    { month: "Mar", value: 7500000 },
    { month: "Apr", value: 9500000 },
    { month: "May", value: 11000000 },
    { month: "Jun", value: 13000000 },
  ];

  const orderData = [
    { month: "Jan", value: 120 },
    { month: "Feb", value: 180 },
    { month: "Mar", value: 150 },
    { month: "Apr", value: 210 },
    { month: "May", value: 260 },
    { month: "Jun", value: 300 },
  ];

  const trafficSourceData = [
    { source: "Google", value: 450 },
    { source: "Trực tiếp", value: 220 },
    { source: "Facebook", value: 180 },
  ];

  const categoryData = [
    { category: "Áo", count: 230 },
    { category: "Quần", count: 150 },
    { category: "Phụ kiện", count: 90 },
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-white">
      <Title level={3} className="text-slate-800 mb-6">
        🛒 Bảng thống kê bán hàng
      </Title>

      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title={
                <Space>
                  <DollarOutlined /> Tổng doanh thu
                </Space>
              }
              value={loadingStats ? "..." : revenue.toLocaleString("vi-VN", { maximumFractionDigits: 0 })}
              suffix="₫"
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card hoverable onClick={() => navigate("/orders")} className="rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition">
            <Statistic
              title={
                <Space>
                  <ShoppingCartOutlined /> Tổng đơn hàng
                </Space>
              }
              value={loadingStats ? "..." : totalOrders}
              suffix=" đơn"
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card hoverable onClick={() => navigate("/users")} className="rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition">
            <Statistic
              title={
                <Space>
                  <UserOutlined /> Khách hàng
                </Space>
              }
              value={loadingStats ? "..." : totalCustomers}
              suffix=" người"
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>

        {/* <Col span={6}>
          <Card
            hoverable
            onClick={() => navigate("/products?filter=low-stock")}
            className="rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition"
          >
            <Statistic
              title={
                <Space>
                  <InboxOutlined /> Top 10 sản phẩm bán chạy
                </Space>
              }
              value={12}
              suffix=" mặt hàng"
              valueStyle={{ color: "#eb2f96" }}
            />
          </Card>
        </Col> */}
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={12}>
          <Card title="📈 Số đơn hàng theo tháng" className="rounded-2xl shadow" variant="outlined">
            <Line data={orderData} xField="month" yField="value" autoFit height={220} point={{ size: 5, shape: "circle" }} smooth color="#1677ff" />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="💰 Doanh thu theo tháng" className="rounded-2xl shadow" variant="outlined">
            <Column data={revenueData} xField="month" yField="value" autoFit height={220} color="#52c41a" columnStyle={{ radius: [6, 6, 0, 0] }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col span={12}>
          <Card title="🌐 Tỉ lệ lượt truy cập" className="rounded-2xl shadow" variant="outlined">
            <Pie
              data={trafficSourceData}
              angleField="value"
              colorField="source"
              autoFit
              height={220}
              radius={1}
              label={{
                position: "outside",
                content: (data: { source: string; percent: number }) => `${data.source}: ${(data.percent * 100).toFixed(1)}%`,
              }}
              tooltip={{
                formatter: (data: { source: any; value: any }) => ({
                  name: data.source,
                  value: `${data.value} lượt`,
                }),
              }}
              interactions={[{ type: "element-active" }]}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="🧥 Phân loại sản phẩm" className="rounded-2xl shadow" variant="outlined">
            <Bar data={categoryData} xField="count" yField="category" autoFit height={220} color="#ffa940" barStyle={{ radius: [6, 6, 0, 0] }} />
          </Card>
        </Col>
      </Row>

      <Col span={40}>
        <Card title="Thống kê theo 1 ngày" className="rounded-2xl shadow" style={{ height: "100%" }} variant="outlined">
          <DailyStatistics />
        </Card>
      </Col>
      <Row gutter={[16, 16]} style={{ alignItems: "stretch" }}>
        <Col span={12}>
          <Card title="Tồn kho sản phẩm" className="rounded-2xl shadow" style={{ height: "100%" }} variant="outlined">
            <StockTable />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Top 10 sản phẩm bán chạy" className="rounded-2xl shadow" style={{ height: "100%" }} variant="outlined">
            <TopProductsTable />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
