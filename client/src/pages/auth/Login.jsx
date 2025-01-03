import { useState } from 'react';
import { Card, Form, Input, Button, Checkbox, Row, Col, Spin, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../states/reducers/authSlice';
import { useNavigate } from 'react-router-dom';


export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoading = useSelector((state) => state.auth.isLoading);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onFinish = () => {
        dispatch(login({ username, password })).then(async (result) => {
            if (result.payload && result.payload.success) {
                navigate('/');
            } else {
                message.error(result.payload ? result.payload.message : 'Login failed');
            }
        });
    };

    return (
        <>
            <Spin tip="Loading..." spinning={isLoading} fullscreen />
            <Row justify="center" align="middle" style={{ minHeight: '100vh', backgroundColor: '#f8f9fc' }}>
                <Col span={20}>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Card title="Login" style={{ width: 400, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 15 }}>
                                <img style={{ marginLeft: "15px", marginRight: "15px", }} width={220} src="/src/assets/images/logo-api.png" alt="" />
                            </div>
                            <Form
                                name="normal_login"
                                className="login-form"
                                initialValues={{
                                    remember: true,
                                }}
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Username!',
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<UserOutlined className="site-form-item-icon" />}
                                        placeholder="Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)} />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Password!',
                                        },
                                    ]}
                                >
                                    <Input
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} />
                                </Form.Item>
                                <Form.Item>
                                    <Form.Item name="remember" valuePropName="checked" noStyle>
                                        <Checkbox>Remember me</Checkbox>
                                    </Form.Item>

                                    <a className="login-form-forgot" href="">
                                        Forgot password
                                    </a>
                                </Form.Item>

                                <Form.Item style={{ textAlign: 'center' }}>
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                        Log in
                                    </Button>
                                    {/* Or <a href="">register now!</a> */}
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                </Col>
            </Row>
        </>
    );
}
