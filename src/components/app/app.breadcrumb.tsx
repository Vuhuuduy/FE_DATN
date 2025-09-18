import { Breadcrumb } from 'antd'
import { useLocation } from 'react-router'

const breadcrumbNameMap: Record<string, { group: string, label: string }> = {
  '/analytics': { group: 'Tổng quan', label: 'Thống kê' },
  '/users': { group: 'Quản lý', label: 'Khách hàng' },
  '/products': { group: 'Quản lý', label: 'Sản phẩm' },
  '/discounts': { group: 'Quản lý', label: 'Khuyến mại' },
  '/categories': { group: 'Quản lý', label: 'Danh mục' },
  '/orders': { group: 'Quản lý', label: 'Đơn hàng' },
  '/comments': { group: 'Quản lý', label: 'Đánh giá' },
  '/contacts': { group: 'Quản lý', label: 'Liên hệ' },

  
}

const AppBreadcrumb = () => {
  const location = useLocation()
  const { pathname } = location

  const current = breadcrumbNameMap[pathname]

  const breadcrumbItems = current
    ? [
        { title: current.group },
        { title: current.label }
      ]
    : [{ title: 'Trang không xác định' }]

  return (
    <Breadcrumb style={{ margin: '16px 0' }} items={breadcrumbItems} />
  )
}

export default AppBreadcrumb
