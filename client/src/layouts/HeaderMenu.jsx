// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { Avatar, Flex } from "antd";
import {
    UserOutlined,
    LogoutOutlined
} from "@ant-design/icons";
import { Dropdown, Typography, Space } from "antd";
const { Text } = Typography;
const url = 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg';


// function getItem(label, key, children) {
//     return {
//         key,
//         children,
//         label,
//     };
// }


const items = [
    {
        label: 'My Profile',
        key: '1',
        icon: <UserOutlined />,
    },
    {
        label: 'Logout',
        key: '2',
        icon: <LogoutOutlined />,
        danger: true,
    },
];

export default function HeaderMenu() {
    const boxStyle = {
        width: '100%',
    };
    // const navigateTo = useNavigate();
    // const [selectedKeys, setSelectedKeys] = useState("1");



    // const handleMenuClick = (event) => {
    //     const { key } = event;
    //     setSelectedKeys(key);
    //     switch (key) {
    //         case "1":
    //             navigateTo("/");
    //             break;
    //         case "2":
    //             navigateTo("/about");
    //             break;
    //         case "3":
    //             navigateTo("/grid");
    //             break;
    //         default:
    //             break;
    //     }
    // };
    return (
        <>

            <Flex style={boxStyle} justify="flex-end">

                <Dropdown
                    menu={{
                        items,
                    }}
                    placement="bottomRight"
                >
                    <Space>

                        <Text>My Name</Text>
                        <Avatar style={{ marginRight: '15px' }} src={<img src={url} alt="avatar" />} />
                    </Space>
                </Dropdown>

            </Flex>
            {/* <Menu defaultSelectedKeys={selectedKeys} onClick={handleMenuClick} mode="horizontal" style={{ flex: 1, minWidth: 0, justifyContent:"flex-end" }} items={header_menus} /> */}
        </>
    )
}
