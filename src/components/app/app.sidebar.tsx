import { useAppSelector } from '@/redux/hooks'
import { BarChartOutlined, BranchesOutlined, DashboardOutlined, DatabaseOutlined, FormOutlined, GiftOutlined, ReadOutlined, ShoppingCartOutlined, ShoppingOutlined, TagOutlined, TeamOutlined } from '@ant-design/icons'
import { Menu, MenuProps } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { Link, useLocation } from 'react-router'

const items: MenuProps['items'] = [
  {
    key: 'overview',
    type: 'group',
    label: 'Tổng quan',
    children: [
      {
        key: '/',
        icon: <DashboardOutlined />,
        label: <Link to={'/'}>Dashboard</Link>
      },
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
        key: '/variants',
        icon: <BranchesOutlined />,
        label: <Link to={'/variants'}>Biến thể</Link>
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
        key: '/coupons',
        icon: <GiftOutlined />,
        label: <Link to={'/coupons'}>Mã giảm giá</Link>
      },
      {
        key: '/reviews',
        icon: <FormOutlined />,
        label: <Link to={'/reviews'}>Đánh giá</Link>
      },
    ]
  }
]

const AppSidebar = () => {
  const isOpenDrawer = useAppSelector((state) => state.app.isOpenDrawer)

  const location = useLocation()

  return (
    <Sider trigger={null} collapsible collapsed={!isOpenDrawer}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        padding: '0 0 20px 0'
      }}>
        <section>
          <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 'bold', color: 'white', textTransform: 'uppercase', letterSpacing: 1 }}>
            <Link to={'/'} style={{ color: 'white' }}>
              <ReadOutlined />
            </Link>
          </div>

          <Menu
            theme='dark'
            mode='inline'
            selectedKeys={[location.pathname]}
            defaultSelectedKeys={['/']}
            items={items}
          />
        </section>
      </div>
    </Sider>
  )
}

export default AppSidebar
