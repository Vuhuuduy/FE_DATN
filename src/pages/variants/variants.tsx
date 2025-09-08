import { Table, Button, message } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/config/axios.customize";
import { IVariant } from "@/types/variants";
import { PlusOutlined } from "@ant-design/icons";
import { getVariantsColums } from "../contants/variantsColums";
import { Link } from "react-router";

const VariantsList = () => {
  const queryClient = useQueryClient();

  // Fetch danh sách biến thể
  const { data: variants = [], isLoading } = useQuery<IVariant[]>({
    queryKey: ["variants"],
    queryFn: async () => {
      const res = await api.get("/api/variants");
      const allVariants: IVariant[] = res.data.data;

      // Lọc trùng theo SKU (giữ lại bản ghi đầu tiên)
      const uniqueVariantsMap = new Map<string, IVariant>();
      for (const v of allVariants) {
        if (!uniqueVariantsMap.has(v.sku)) {
          uniqueVariantsMap.set(v.sku, v);
        }
      }
      return Array.from(uniqueVariantsMap.values());
    },
  });

  // Mutation xoá biến thể
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/variants/${id}`);
    },
    onSuccess: () => {
      message.success("Xoá biến thể thành công");
      queryClient.invalidateQueries({ queryKey: ["variants"] });
    },
    onError: () => {
      message.error("Xoá thất bại");
    },
  });

  // Hàm xoá
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const columns = getVariantsColums(queryClient, handleDelete);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2>Danh sách biến thể</h2>
        <Link to="/variants/add">
          <Button icon={<PlusOutlined />} type="primary">
            Thêm biến thể
          </Button>
        </Link>
      </div>

      <Table columns={columns} dataSource={variants} loading={isLoading} rowKey={(record) => record._id!} pagination={{ pageSize: 10 }} />
    </>
  );
};

export default VariantsList;
