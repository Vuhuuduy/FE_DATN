import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Table } from "antd";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import api from "@/config/axios.customize";
import { IDiscounts } from "../../types/discounts";
import { getDiscountsColumns } from "../contants/discountsColums";

export default function Discounts() {
  const queryClient = useQueryClient();

  // Fetch danh sách khuyến mãi
  const { data, isLoading } = useQuery<IDiscounts[]>({
    queryKey: ["discounts"],
    queryFn: async () => {
      const res = await api.get("api/discounts");
      return Array.isArray(res.data.data) ? res.data.data : [res.data.data];
    },
  });

  // Xoá khuyến mãi
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`api/discounts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      message.success("Xoá khuyến mãi thành công");
    },
    onError: () => {
      message.error("Xoá khuyến mãi thất bại");
    },
  });

  const handleDelete = (id: string) => {
    if (id) mutation.mutate(id);
  };

  const columns = getDiscountsColumns(queryClient, handleDelete);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h2>Danh sách khuyến mãi</h2>
        <Link to="/discounts/add">
          <Button
            icon={<PlusOutlined />}
            style={{
              backgroundColor: "white",
              color: "dodgerblue",
              borderColor: "dodgerblue",
            }}
          >
            Thêm mới
          </Button>
        </Link>
      </div>

      <Table loading={isLoading} dataSource={data || []} columns={columns} rowKey={(record) => record._id || record.code || Math.random().toString()} />
    </>
  );
}
