import { MenuOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { Dropdown, Space, Button } from 'antd';
const items = [
  {
    key: '4',
    label: 'Sales',
    children: [
      {
        key: '4-4',
        label: 'Sales Order'
      },
      {
        key: '4-5',
        label: 'Sales Invoice'
      },
      {
        key: '4-6',
        label: 'Sales Revenue'
      },
      {
        key: '4-7',
        label: 'Sales Revenue By Delivery'
      }
    ]
  },
  {
    key: '5',
    label: 'Accounting',
    children: [
      {
        key: '5-1',
        label: 'GL Journal'
      },
      {
        key: '5-2',
        label: 'Summary Account'
      }
    ]
  },
  {
    key: '6',
    label: 'Purchase',
    children: [
      {
        key: '6-1',
        label: 'Purchase Invoice'
      },
      {
        key: '6-2',
        label: 'Vendor Due Date'
      },
    ]
  }
];
const AppMenu = ({onMenuClick}) => (
  <Dropdown
    menu={{
      items,
      onClick: (e) => {
        if (onMenuClick) {
          onMenuClick(e.key); // Menangani klik menu
        }
      },
    }}
    trigger={['click']}
  >
    <Button>
        <Space>
        <MenuOutlined />
        </Space>
      </Button>
  </Dropdown>
);

AppMenu.propTypes = {
    onMenuClick: PropTypes.func
}
export default AppMenu;