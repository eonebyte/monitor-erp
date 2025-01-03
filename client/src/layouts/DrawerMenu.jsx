import { DownOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { Dropdown, Space, Button } from 'antd';
const items = [
  {
    key: '1',
    label: 'About',
  },
  {
    key: '2',
    label: 'Contact',
    children: [
      {
        key: '2-1',
        label: 'List Contact',
      },
      {
        key: '2-2',
        label: 'Contact Detail',
      },
    ],
  },
];
const DrawerMenu = ({onMenuClick}) => (
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
          All Menu
          <DownOutlined />
        </Space>
      </Button>
  </Dropdown>
);

DrawerMenu.propTypes = {
    onMenuClick: PropTypes.func
}
export default DrawerMenu;