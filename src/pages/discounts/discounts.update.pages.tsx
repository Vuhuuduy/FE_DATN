import api from '@/config/axios.customize'
import dayjs from 'dayjs'
import { Button, DatePicker, Form, Input, message, Select } from 'antd'
import { IDiscounts } from '../../types/discounts'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

const { RangePicker } = DatePicker

export default function DiscountsUpdate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const { data } = useQuery({
    queryKey: ['discounts', id],
    queryFn: async () => {
      const res = await api.get(`api/discounts/${id}`)
      return res.data.data || {}
    },
    enabled: !!id,
  })

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        discount_value: Number(data.discount_value),
        minOrderValue: Number(data.minOrderValue),
        maxDiscountValue: Number(data.maxDiscountValue),
        date: Array.isArray(data.date)
          ? data.date.map((d: string) => dayjs(d))
          : [],
      })
    }
  }, [data, form])

  const onFinish = async (values: IDiscounts) => {
    try {
      const payload = {
        ...values,
        discount_value: Number(values.discount_value),
        minOrderValue: Number(values.minOrderValue),
        maxDiscountValue: Number(values.maxDiscountValue),
        date: values.date?.map((d: any) => d.toISOString()) || [],
      }

      await api.put(`api/discounts/${id}`, payload)
      message.success('Cập nhật khuyến mãi thành công!')
      navigate('/discounts')
    } catch (error: any) {
      const msg = error?.response?.data?.message
      if (msg) {
        if (msg.toLowerCase().includes('đã tồn tại') || msg.toLowerCase().includes('duplicate')) {
          message.error('Mã khuyến mãi đã tồn tại!')
        } else {
          message.error(msg)
        }
        console.error('Lỗi sửa khuyến mãi:', msg)
      } else {
        message.error('Cập nhật thất bại!')
        console.error(error)
      }
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      style={{ maxWidth: 800, margin: '0 auto' }}
      onFinish={onFinish}
    >
      <Form.Item
        label="Mã khuyến mãi"
        name="code"
        rules={[{ required: true, message: 'Vui lòng nhập mã khuyến mãi' }]}
      >
        <Input placeholder="VD: KM2025" />
      </Form.Item>

      <Form.Item
        label="Phân loại"
        name="discount_type"
        rules={[{ required: true, message: 'Vui lòng chọn loại khuyến mãi' }]}
      >
        <Select placeholder="-- Chọn loại --">
          <Select.Option value="%">Giảm theo phần trăm</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Giá trị giảm (%)"
        name="discount_value"
        rules={[
          { required: true, message: 'Vui lòng nhập giá trị giảm' },
          {
            validator: (_, value) => {
              if (value === undefined || value === null || value === '') {
                return Promise.resolve()
              }
              if (value <= 0) {
                return Promise.reject('Giá trị phải lớn hơn 0')
              }
              if (value > 100) {
                return Promise.reject('Giá trị không được vượt quá 100%')
              }
              return Promise.resolve()
            },
          },
        ]}
      >
        <Input type="number" placeholder="VD: 15" />
      </Form.Item>

      {/* Giảm giá tối đa */}
      <Form.Item
        label="Giảm giá tối đa (VNĐ)"
        name="maxDiscountValue"
        rules={[{ required: true, message: 'Vui lòng nhập giá trị tối đa' }]}
      >
        <Input type="number" placeholder="VD: 200000" />
      </Form.Item>

      <Form.Item
        label="Đơn hàng tối thiểu (VNĐ)"
        name="minOrderValue"
        rules={[{ required: true, message: 'Vui lòng nhập giá trị đơn hàng tối thiểu' }]}
      >
        <Input type="number" placeholder="VD: 500000" />
      </Form.Item>

      <Form.Item
        label="Trạng thái"
        name="status"
        rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
      >
        <Select placeholder="-- Chọn trạng thái --">
          <Select.Option value="active">Mở</Select.Option>
          <Select.Option value="inactive">Khoá</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Thời gian áp dụng"
        name="date"
        rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
      >
        <RangePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  )
}
