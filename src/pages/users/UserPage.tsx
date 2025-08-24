import { useEffect, useState } from "react";
import { Button } from "antd";
import UserEdit from "./UserEdit";
import UserTable from "./UserTable";
import UserFilter from "./UserFilter";
import { getAllUsers } from "@/apis/user";

export default function UserPage() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const fetchData = async () => {
    const res = await getAllUsers();
    const filtered = res.filter((user: any) => {
      const isUser = user.role === "user";
      const matchesKeyword = user.fullname?.toLowerCase().includes(keyword.toLowerCase()) || user.email?.toLowerCase().includes(keyword.toLowerCase());

      const matchesStatus = status === null || (status === "active" && user.isActive) || (status === "blocked" && !user.isActive);

      return isUser && matchesKeyword && matchesStatus;
    });

    setUsers(filtered);
  };

  useEffect(() => {
    fetchData();
  }, [keyword, status]);

  const handleEdit = (user: any) => {
    // Chỉ giữ các dữ liệu primitive, không truyền object MongoDB thô
    const defaultAddress = Array.isArray(user.address) ? user.address.find((addr: any) => addr.default) : null;

    setSelectedUser({
      _id: user._id,
      fullname: user.fullname ?? "",
      email: user.email ?? "",
      phoneNumber: user.phoneNumber ?? "",
      city: defaultAddress?.city ?? "",
      isActive: !!user.isActive,
    });
    setOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Quản lý người dùng</h2>
      </div>

      <UserFilter
        onFilter={(keyword, status) => {
          setKeyword(keyword);
          setStatus(status);
        }}
      />

      <UserTable data={users} onEdit={handleEdit} onReload={fetchData} />

      {/* ... phần trên giữ nguyên */}

      {open && <UserEdit open={open} onClose={() => setOpen(false)} user={selectedUser} onSuccess={fetchData} />}
    </div>
  );
}
