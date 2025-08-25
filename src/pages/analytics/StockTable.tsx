import { useEffect, useState } from "react";
import { Table, message } from "antd";
import api from "@/config/axios.customize";

export default function StockTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setLoading(true);

        // Gọi API lấy tất cả variants và products
        const [variantsRes, productsRes] = await Promise.all([api.get("/api/variants"), api.get("/api/products")]);

        const variants = variantsRes.data?.data || [];
        const products = productsRes.data?.data || [];

        // Map productId -> productName
        const productMap = new Map(products.map((p: any) => [p._id, p.name]));

        // Ghép dữ liệu
        const tableData = variants.map((variant: any) => {
          const productId = typeof variant.productId === "object" ? variant.productId?._id : variant.productId || variant.product;

          const productName = productMap.get(productId) || "Sản phẩm";
          const color = variant.color || "";
          const size = variant.size || "";

          return {
            key: variant._id,
            name: `${productName} - ${color} - ${size}`.replace(/ - $/, ""), // Xóa dấu '-' nếu thiếu size/màu
            stock: variant.stock_quantity ?? 0,
          };
        });

        setData(tableData);
      } catch (error: any) {
        console.error("Lỗi khi lấy dữ liệu tồn kho:", error);
        message.error(error.response?.data?.message || "Không thể tải dữ liệu tồn kho");
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  const columns = [
    { title: "Tên sản phẩm", dataIndex: "name" },
    { title: "Tồn kho", dataIndex: "stock" },
  ];

  return <Table columns={columns} dataSource={data} loading={loading} pagination={{ pageSize: 10 }} />;
}
