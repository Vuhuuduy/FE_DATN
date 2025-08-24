import { Input, Select, Space, Button } from "antd"
import { useState } from "react"

type Props = {
  onFilter: (keyword: string, status: string | null) => void
}

export default function UserFilter({ onFilter }: Props) {
  const [keyword, setKeyword] = useState("")
  const [status, setStatus] = useState<string | null>(null)

  const handleSearch = () => {
    onFilter(keyword, status)
  }

  return (
    <Space className="my-4" wrap>
      <Input
        placeholder="Tìm theo tên hoặc email"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        allowClear
      />
      <Select
        placeholder="Trạng thái"
        allowClear
        value={status}
        onChange={(value) => setStatus(value)}
        style={{ width: 150 }}
        options={[
          { value: "active", label: "Hoạt động" },
          { value: "blocked", label: "Bị khóa" },
        ]}
      />
      <Button type="primary" onClick={handleSearch}>
        Tìm kiếm
      </Button>
    </Space>
  )
}
