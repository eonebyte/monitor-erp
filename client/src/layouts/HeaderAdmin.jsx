import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, LogoutOutlined, MoreOutlined, SunOutlined, MoonOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { Layout, Button, Flex, Dropdown, Space, Avatar, Typography, theme } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const { Text } = Typography;
const url = 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';
import { logout } from '../states/reducers/authSlice';
import AppMenu from "../components/AppMenu";
// import SearchMenu from "../components/SearchMenu";

const { Header } = Layout;
export default function HeaderAdmin({
  isDarkMode, 
  handleModeClick,
  open,
  isMobile,
  showDrawer,
  onMenuClick,
}) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
      };

  const {
    token: { colorBgContainer = "#fff" },
  } = theme.useToken();

  const [showBox, setShowBox] = useState(false);
  const toggleBox = () => {
    setShowBox(!showBox);
  };

  const boxStyle = {
    width: '100%',
  };

  const items = [
    {
      label: user.name,
      key: '1',
      icon: <UserOutlined />,
    },
    {
      label: 'Logout',
      key: '2',
      icon: <LogoutOutlined />,
      danger: true,
      onClick: handleLogout
    },
  ];

  return (
    <>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
          display: "flex",
          alignItems: "center",
          borderBottom: isDarkMode ? "1px solid black" : "1px solid #e3e6f0",
        }}
      >
        {!isMobile ? (
          <>
            {/* <img style={{ marginLeft: "15px", marginRight: "15px", }} width={30} src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" alt="" /> */}
            <img style={{ marginLeft: "15px", marginRight: "15px", }} width={50} src="/src/assets/logo_pkg.png" alt="" />
      {/* <SearchMenu onMenuClick={onMenuClick} /> */}
      <AppMenu onMenuClick={onMenuClick} />
            <Flex style={boxStyle} justify="flex-end" align="center">

              <Space>
              <Dropdown
                menu={{
                  items,
                }}
                placement="bottomRight"
              >
                <Space>
                      <Text>{user.name}</Text>
                  <Avatar src={<img src="/src/assets/user.png" alt="avatar" />} />
                </Space>
              </Dropdown>

              <Button style={{ marginRight: '15px' }} size="small" onClick={handleModeClick}>
                {isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              </Button>
              </Space>

            </Flex></>
        )
          :
          <Flex style={boxStyle} justify="space-between" align="center">
            <Button
              type="text"
              icon={open ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={showDrawer}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <img style={{ marginLeft: "15px", marginRight: "15px", }} width={110} src="/src/assets/images/logo-api.png" alt="" />
            <MoreOutlined onClick={toggleBox} style={{ marginRight: '15px', fontSize: '18px' }} />
          </Flex>
        }
      </Header>
      {showBox && (
        <Flex justify="flex-end" style={{ padding: "10px", backgroundColor: colorBgContainer }}>
          <Space>
            <Dropdown
              menu={{
                items,
              }}
              placement="bottomRight"
            >
              <Space>

                <Text>{ user.name }</Text>
                <Avatar src={<img src={url} alt="avatar" />} />
              </Space>
            </Dropdown>

            <Button style={{ marginRight: '15px' }} size="small" onClick={handleModeClick}>
              {isDarkMode ? <SunOutlined /> : <MoonOutlined />}
            </Button>
          </Space>
        </Flex>

      )}
    </>
  );
}

HeaderAdmin.propTypes = {
  isDarkMode: PropTypes.bool,
  handleModeClick: PropTypes.func,
  open: PropTypes.bool,
  isMobile: PropTypes.bool,
  showDrawer: PropTypes.func,
  onMenuClick: PropTypes.func
};
