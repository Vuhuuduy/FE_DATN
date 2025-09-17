import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Input, message, Table } from 'antd'
import { Link } from 'react-router-dom'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useState, useMemo } from 'react'
import api from '@/config/axios.customize'
import { IDiscounts } from '../../types/discounts'
import { getDiscountsColumns } from '../contants/discountsColums'

export default function Discounts() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')

  // Fetch danh sách khuyến mãi
  const { data, isLoading } = useQuery<IDiscounts[]>({
    queryKey: ['discounts'],
    queryFn: async () => {
      const res = await api.get('api/discounts')
      const discounts = Array.isArray(res.data.data) ? res.data.data : [res.data.data]

      const now = new Date()

      // Gắn lại status dựa vào ngày hết hạn
      return discounts.map((d: IDiscounts) => {
        if (d.date && d.date.length > 1) {
          const endDate = new Date(d.date[1])
          if (endDate < now) {
            return { ...d, status: 'inactive' }
          }
        }
        return d
      })
    },
  })

  // Xoá khuyến mãi
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`api/discounts/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discounts'] })
      message.success('Xoá khuyến mãi thành công')
    },
    onError: () => {
      message.error('Xoá khuyến mãi thất bại')
    }
  })

  const handleDelete = (id: string) => {
    if (id) mutation.mutate(id)
  }

  const columns = getDiscountsColumns(queryClient, handleDelete)

  // Filter data theo search
  const filteredData = useMemo(() => {
    if (!data) return []
    return data.filter((d) =>
      d.code?.toLowerCase().includes(search.toLowerCase()) ||
      d.description?.toLowerCase().includes(search.toLowerCase())
    )
  }, [data, search])

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12
        }}
      >
        <h2>Danh sách khuyến mãi</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            placeholder="Tìm kiếm khuyến mãi..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
          />
          <Link to="/discounts/add">
            <Button
              icon={<PlusOutlined />}
              style={{
                backgroundColor: 'white',
                color: 'dodgerblue',
                borderColor: 'dodgerblue'
              }}
            >
              Thêm mới
            </Button>
          </Link>
        </div>
      </div>

      <Table
        loading={isLoading}
        dataSource={filteredData}
        columns={columns}
        rowKey={(record) => record._id || record.code || Math.random().toString()}
      />
    </>
  )
}
