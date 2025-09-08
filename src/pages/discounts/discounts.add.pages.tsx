import api from '@/config/axios.customize'
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import { IDiscounts } from '../../types/discounts'

const { RangePicker } = DatePicker

export default function DiscountsAdd() {
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const onFinish = async (values: IDiscounts) => {
    try {
      const payload = {
        ...values,
        discount_value: Number(values.discount_value),
        minOrderValue: Number(values.minOrderValue),
        date: values.date?.map((d: any) => d.toISOString()) || [],
      }

      await api.post('api/discounts/add', payload)
      message.success('Thêm khuyến mãi thành công!')
      navigate('/discounts')
    } catch (error: any) {
      const msg = error?.response?.data?.message
      if (msg) {
        if (
          msg.toLowerCase().includes('đã tồn tại') ||
          msg.toLowerCase().includes('duplicate')
        ) {
          message.error('Mã khuyến mãi đã tồn tại!')
        } else {
          message.error(msg)
        }
        console.error('Lỗi:', msg)
      } else {
        message.error('Thêm khuyến mãi thất bại!')
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
      {/* Mã khuyến mãi */}
      <Form.Item
        label="Mã khuyến mãi"
        name="code"
        rules={[{ required: true, message: 'Vui lòng nhập mã khuyến mãi' }]}
      >
        <Input placeholder="VD: KM2025" />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          {/* Phân loại */}
          <Form.Item
            label="Phân loại"
            name="discount_type"
            rules={[{ required: true, message: 'Vui lòng chọn loại khuyến mãi' }]}
          >
            <Select placeholder="-- Chọn loại --">
              <Select.Option value="%">Giảm theo phần trăm</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          {/* Giá trị giảm */}
          <Form.Item
            label="Giá trị giảm (%)"
            name="discount_value"
            rules={[{ required: true, message: 'Vui lòng nhập giá trị' }]}
          >
            <Input type="number" placeholder="VD: 15" />
          </Form.Item>
        </Col>
      </Row>

      {/* Đơn hàng tối thiểu */}
      <Form.Item
        label="Đơn hàng tối thiểu (VNĐ)"
        name="minOrderValue"
        rules={[
          { required: true, message: 'Vui lòng nhập giá trị tối thiểu đơn hàng' },
        ]}
      >
        <Input type="number" placeholder="VD: 500000" />
      </Form.Item>

      {/* Trạng thái */}
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

      {/* Thời gian áp dụng */}
      <Form.Item
        label="Thời gian áp dụng"
        name="date"
        rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
      >
        <RangePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Xác nhận
        </Button>
      </Form.Item>
    </Form>
  )
}
