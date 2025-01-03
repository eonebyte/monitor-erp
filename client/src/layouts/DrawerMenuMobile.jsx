import { Menu, Drawer } from 'antd';
import { useState } from 'react';
import PropTypes from 'prop-types';

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const drawer_menus = [
  getItem('About', '1', null),
  getItem('Contact', '2', null, [
    getItem('List Contact', '2-1'),
    getItem('Contact Detail', '2-2'),
  ]),
];

export default function DrawerMenuMobile({ placement, onClose, open, onMenuClick }) {
  const [selectedKeys, setSelectedKeys] = useState('1');

  const handleMenuClick = (event) => {
    const { key } = event;
    setSelectedKeys(key);
    if (onMenuClick) {
      onMenuClick(key);
    }
  };

  const drawerStyles = {
    body: { padding: 0 },
  };

  return (
    <Drawer
      styles={drawerStyles}
      width={260}
      title="Menu"
      placement={placement}
      closable={true}
      onClose={onClose}
      open={open}
      key={placement}
    >
      <Menu
        defaultSelectedKeys={[selectedKeys]}
        onClick={handleMenuClick}
        mode="inline"
        items={drawer_menus}
      />
    </Drawer>
  );
}

DrawerMenuMobile.propTypes = {
  placement: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  onMenuClick: PropTypes.func,
};
