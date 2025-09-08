// src/pages/analytics/TopProductsTable.tsx
import { Table } from "antd";
import { useQuery } from "@tanstack/react-query";
import { getTopProducts } from "@/apis/stats";

export default function TopProductsTable() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["top-products"],
    queryFn: () => getTopProducts(10),
  });

  const columns = [
    {
      title: "#",
      dataIndex: "rank",
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    { title: "Sản phẩm", dataIndex: "name" },
    { title: "Đã bán", dataIndex: "totalSold", width: 100 },
  ];

  return <Table columns={columns} dataSource={data} loading={isLoading} pagination={false} />;
}
