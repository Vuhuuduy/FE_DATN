import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Table } from "antd";
import { Link } from "react-router";
import { IProduct } from "../../types/product.ts";
import api from "@/config/axios.customize.ts";
import { PlusOutlined } from "@ant-design/icons";
import { getProductColumns } from "../contants/productColum.tsx";

const ProductsPage = () => {
  const queryClient = useQueryClient();

  const { data: rawData = [] } = useQuery<IProduct[]>({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const res = await api.get("api/products");
        const products = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
        return products;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
  });

  // Lọc bỏ sản phẩm bị trùng theo _id
  const data = rawData.filter((item, index, self) => index === self.findIndex((t) => t._id === item._id));

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await api.delete(`api/products/${id}`);
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      message.success("Xoá sản phẩm thành công!");
    },
  });

  const DelProduct = (id: string) => {
    mutation.mutate(id);
  };

  const columns = getProductColumns(queryClient, DelProduct);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 11,
        }}
      >
        <h1>Danh sách sản phẩm</h1>
        <Link to={"/products/add"}>
          <Button
            icon={<PlusOutlined />}
            size="small"
            style={{
              backgroundColor: "white",
              color: "dodgerblue",
              borderColor: "dodgerblue",
            }}
          />
        </Link>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        rowKey={(record) => record._id as string} // Đảm bảo đúng key
        pagination={{ pageSize: 2 }}
        scroll={{ y: 500 }}
      />
    </>
  );
};

export default ProductsPage;
