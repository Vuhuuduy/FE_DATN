import { useState, useEffect } from "react";
import { Card, Col, Row, DatePicker, Statistic, message } from "antd";
import dayjs, { Dayjs } from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import api from "@/config/axios.customize";

// Kích hoạt plugin
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const { RangePicker } = DatePicker;

export default function DailyStatistics() {
  const [dates, setDates] = useState<[Dayjs, Dayjs]>([dayjs().startOf("day"), dayjs().endOf("day")]);
  const [loading, setLoading] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);

  const fetchRangeData = async (startDate: Dayjs, endDate: Dayjs) => {
    try {
      setLoading(true);

      // Gọi API lấy toàn bộ orders
      const res = await api.get(`/api/orders`);
      const allOrders = Array.isArray(res.data) ? res.data : res.data?.data || [];

      // Lọc theo khoảng ngày
      const ordersInRange = allOrders.filter((o: any) => {
        const created = dayjs(o.createdAt);
        return created.isSameOrAfter(startDate, "day") && created.isSameOrBefore(endDate, "day");
      });

      const total = ordersInRange.length;
      const completedOrdersList = ordersInRange.filter((o: any) => o.status === "Đã hoàn thành");
      const completedCount = completedOrdersList.length;

      const revenue = completedOrdersList.reduce((sum: number, order: any) => sum + (order.totalPrice || order.totalAmount || 0), 0);

      setTotalOrders(total);
      setTotalRevenue(revenue);
      setCompletedOrders(completedCount);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dates[0] && dates[1]) {
      fetchRangeData(dates[0], dates[1]);
    }
  }, [dates]);

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <RangePicker value={dates} onChange={(val) => (val ? setDates([val[0]!.startOf("day"), val[1]!.endOf("day")]) : null)} format="YYYY-MM-DD" />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic title={<span style={{ fontSize: 14 }}>Tổng đơn hàng</span>} value={totalOrders} valueRender={(node) => <span style={{ fontSize: 18, fontWeight: "bold" }}>{node}</span>} />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic
              title={<span style={{ fontSize: 14 }}>Tổng doanh thu</span>}
              value={totalRevenue}
              formatter={(value) => new Intl.NumberFormat("vi-VN").format(Number(value)) + " ₫"}
              valueRender={(node) => <span style={{ fontSize: 18, fontWeight: "bold" }}>{node}</span>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading}>
            <Statistic title={<span style={{ fontSize: 14 }}>Đơn đã hoàn thành</span>} value={completedOrders} valueRender={(node) => <span style={{ fontSize: 18, fontWeight: "bold" }}>{node}</span>} />
          </Card>
        </Col>
      </Row>
    </>
  );
}
