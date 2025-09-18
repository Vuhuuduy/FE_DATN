import { BarChartOutlined, BranchesOutlined, DashboardOutlined, DatabaseOutlined, FormOutlined, GiftOutlined, ShoppingCartOutlined, ShoppingOutlined, TagOutlined, TeamOutlined, MailOutlined  } from '@ant-design/icons'
import { MenuProps } from 'antd'
import { Link } from 'react-router'

export const itemsRoute: MenuProps['items'] = [
  {
    key: 'overview',
    type: 'group',
    label: 'Tổng quan',
    children: [
      // {
      //   key: '/',
      //   icon: <DashboardOutlined />,
      //   label: <Link to={'/analytics'}>Dashboard</Link>
      // },
      {
        key: '/analytics',
        icon: <BarChartOutlined />,
        label: <Link to={'/analytics'}>Thống kê</Link>
      }
    ]
  },
  {
    key: 'management',
    type: 'group',
    label: 'Quản lý',
    children: [
      {
        key: '/users',
        icon: <TeamOutlined />,
        label: <Link to={'/users'}>Khách hàng</Link>
      },
      {
        key: '/products',
        icon: <ShoppingOutlined />,
        label: <Link to={'/products'}>Sản phẩm</Link>
      },
      {
        key: '/comments',
        icon: <BranchesOutlined />,
        label: <Link to={'/comments'}>Đánh giá</Link>
      },
      {
        key: '/discounts',
        icon: <TagOutlined />,
        label: <Link to={'/discounts'}>Khuyến mại</Link>
      },
      {
        key: '/categories',
        icon: <DatabaseOutlined />,
        label: <Link to={'/categories'}>Danh mục</Link>
      },
      {
        key: '/orders',
        icon: <ShoppingCartOutlined />,
        label: <Link to={'/orders'}>Đơn hàng</Link>
      },
       {
        key: '/contacts',
        icon: <MailOutlined />,
        label: <Link to={'/contacts'}>Liên hệ</Link>
      }
      
    ]
  }
]