import PropTypes from 'prop-types';
import { Layout, theme } from 'antd';
const { Content } = Layout;

export function TabPaneWrapper({ children, ...props }) {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
            <Content
                style={{
                    // padding: '0 48px',
                }}
                {...props}
            >
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 15,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}

                </div>
            </Content>
    );
}

TabPaneWrapper.propTypes = {
    children: PropTypes.element.isRequired,
};
