import React from 'react';
import { Button, Row, Col, Form, Input } from 'antd';
import { useNavigate } from "react-router-dom";



const Login = () => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        if (values?.lat) {
            console.log('Success for customer:', values);
            navigate("/customer-view")
        } else {
            console.log('Success for sitemanager:', values);
            navigate("/site-manager-view")
        }

    };

    return (
        <div className='loginPage'>
            <h2 style={{ textAlign: 'center' }}>Welcome to Consignment Store</h2>
            <br />
            <br />
            <Row>
                <Col className="gutter-row" span={12}>
                    <Form
                        name="basic"
                        labelCol={{ span: 8, }}
                        wrapperCol={{ span: 16, }}
                        style={{
                            maxWidth: 600, marginTop: "50px"
                        }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your email!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>


                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Log in as Site Manager
                            </Button>
                        </Form.Item>

                        {/* <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Log in as Site Manager
                            </Button>
                        </Form.Item> */}

                    </Form>
                </Col>
                <Col className="gutter-row" span={6}>
                    <Form
                        name="basic2"
                        labelCol={{ span: 8, }}
                        wrapperCol={{ span: 16, }}
                        style={{
                            maxWidth: 600, marginTop: "50px"
                        }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Latitude"
                            name="lat"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your lat!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Longitude"
                            name="long"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your long!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>


                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Log in as Customer
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}

export default Login
