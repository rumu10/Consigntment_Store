import React from 'react';
import { Button, Row, Col, Form, Input, Flex, Alert } from 'antd';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { API_ENDPOINT } from '../../config';
import CustomNotification from '../../Util/Notification/Notification';

const Login = () => {

    const navigate = useNavigate();
    const [formInstance] = Form.useForm();

    const onLogin = async (userType) => {

        const values = formInstance.getFieldsValue();

        console.log('Success for site manager:', values, userType);

        if (userType == 'site') {
            try {
                const { data } = await axios.post(`${API_ENDPOINT}login-site-manager`, values);
                console.log(data)
                if (data) {
                    navigate(`/site-manager-view/${data?.data?.manager_id}`)
                    CustomNotification("Done!", "Login Successful", "success");
                } else {
                    console.log("eerrrr login site manager")
                }

            } catch (e) {
                console.log(e);
            }
        } else if (userType == 'store') {
            try {
                const { data } = await axios.post(`${API_ENDPOINT}login-store-owner`, values);
                console.log(data)
                if (data) {
                    navigate(`/store-view/${data?.data?.store_id}`)
                    CustomNotification("Done!", "Login Successful", "success");
                } else {
                    console.log("eerrrr login site manager")
                }

            } catch (e) {
                console.log(e);
            }
        }
    };


    const onFinish_Customer = async (values) => {

        console.log('Success for customer:', values);
        try {
            const { data } = await axios.post(`${API_ENDPOINT}login`, values);
            console.log(data)

            navigate("/customer-view")
        } catch (e) {
            console.log(e);
        }
        navigate("/customer-view")
    };

    const onFinish_CreateStore = async (values) => {

        console.log('create store called.');
        navigate("/create-store")
    };

    return (
        <div className='loginPage'>
            <h2 style={{ textAlign: 'center' }}>Welcome to Our Consignment Store</h2>
            <br />
            <br />
            <Row>
                <Col className="gutter-row" lg={{ span: 9, offset: 3 }}>
                    <Form
                        name="siteOwnerLogin"
                        labelCol={{ span: 8, }}
                        wrapperCol={{ span: 16, }}
                        style={{
                            maxWidth: 600, marginTop: "50px"
                        }}
                        // onFinish={onLogin}
                        form={formInstance}
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

                        <Flex gap="small" wrap="wrap" style={{ marginLeft: '150px' }}>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" name="SiteManager" htmlType="submit" onClick={e => onLogin('site')}>
                                    Log in as Site Owner
                                </Button>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" name="Store" htmlType="submit" onClick={e => onLogin('store')}>
                                    Log in as Store Owner
                                </Button>
                            </Form.Item>
                        </Flex>

                    </Form>
                    <h4 style={{ marginLeft: '150px' }}>Are you a new store owner that needs to be registered? Click create store below!</h4>
                    <br />
                    <Form
                        name="basic2"

                        onFinish={onFinish_CreateStore}
                        autoComplete="off"
                    >
                        <Form.Item
                            wrapperCol={{
                                offset: 9,
                                span: 16,
                            }}
                        >
                            <Button type="primary" style={{ background: "green", borderColor: "yellow" }} htmlType="submit" >
                                Create Store
                            </Button>
                        </Form.Item>

                    </Form>
                </Col>

                <Col className="gutter-row" span={6}>
                    <Form
                        name="basic3"
                        labelCol={{ span: 8, }}
                        wrapperCol={{ span: 16, }}
                        style={{
                            maxWidth: 600, marginTop: "50px"
                        }}
                        onFinish={onFinish_Customer}
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
                            <Button type="primary" name="Customer" htmlType="submit">
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
