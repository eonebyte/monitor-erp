import { useState } from "react";
import { Layout, theme, ConfigProvider } from "antd";
import PropTypes from 'prop-types';
import DrawerMenuMobile from "./DrawerMenuMobile";
import HeaderAdmin from "./HeaderAdmin";
import FooterAdmin from "./FooterAdmin";

const { defaultAlgorithm, darkAlgorithm } = theme;
const { Content } = Layout;

import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../states/reducers/themeSlice";

function LayoutAdmin({onMenuClick, children}) {

  const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.theme.isDarkMode);
    const handleClick = () => {
      dispatch(toggleDarkMode()); // Mengirimkan action untuk mengubah status tema
  };

  // const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer,borderRadiusLG, boxShadow },
  } = theme.useToken();

  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [placement] = useState("left");
  const [open, setOpen] = useState(false);
    const showDrawer = () => {
      setOpen(true);
    };
    const onClose = () => {
      setOpen(false);
    };

  return (
    <ConfigProvider theme={{
      algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
  }}>
    <Layout style={{ minHeight: "100vh", margin: "0" }}>
      <DrawerMenuMobile
        placement={placement}
        onClose={onClose}
        open={open}
      />
      <HeaderAdmin
        isDarkMode={isDarkMode}
        handleModeClick={handleClick}
        open={open}
        isMobile={isMobile}
        showDrawer={showDrawer}
        onMenuClick={onMenuClick}
      />
      <Layout>
        {/* {isMobile ? null : (
          <Sider
            style={{borderRight: isDarkMode ? "1px solid black" : "1px solid #e3e6f0"}}
            collapsedWidth={50}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            theme={isDarkMode ? "dark" : "light"}
          >
            <DrawerMenu />
          </Sider>
        )} */}

        <Content
          style={{
            margin: "5px",
            backgroundColor: isDarkMode ? "#001529" : colorBgContainer, 
            // padding: 15,
            minHeight: 360,
            borderRadius: borderRadiusLG,
            border: isDarkMode ? "1px solid black" : "1px solid #e3e6f0",
            boxShadow: boxShadow,
          }}
        >
          {children}
        </Content>
      </Layout>
      <FooterAdmin />
    </Layout>
    </ConfigProvider>
  );
}

LayoutAdmin.propTypes = {
  children: PropTypes.element,
  onMenuClick: PropTypes.func
}



export default LayoutAdmin;
