import React from 'react';
import { Button, Row, Col, Form, Input } from 'antd';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { API_ENDPOINT } from '../../config';

const Login = () => {
    const navigate = useNavigate();

    const onFinish_SiteManager = async (values) => {

        console.log('Success for site manager:', values);
        try {
            const { data } = await axios.post(`${API_ENDPOINT}login`, values);
            console.log(data)

            navigate("/site-manager-view")
        } catch (e) {
            console.log(e);
        }
        navigate("/site-manager-view")
    };

    const onFinish_StoreOwner = async (values) => {
        console.log('Success for store owner:', values);
        try {
            const { data } = await axios.post(`${API_ENDPOINT}login`, values);
            console.log(data)

            navigate("/store-view")
        } catch (e) {
            console.log(e);
        }
        navigate("/store-view")
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
            <h2 style={{ textAlign: 'center' }}>Welcome to Consignment Store</h2>
            <br />
            <br />
            <Row>
                <Col className="gutter-row" span={9}>
                    <Form
                        name="basic"
                        labelCol={{ span: 8, }}
                        wrapperCol={{ span: 16, }}
                        style={{
                            maxWidth: 600, marginTop: "50px"
                        }}
                        onFinish={onFinish_SiteManager}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Administrator"
                            name="adminEmail"
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
                            <Button type="primary" name="SiteManager" htmlType="submit">
                                Log in as Site Manager
                            </Button>
                        </Form.Item>

                    </Form>

                    <Form
                        name="siteOwnerLogin"
                        labelCol={{ span: 8, }}
                        wrapperCol={{ span: 16, }}
                        style={{
                            maxWidth: 600, marginTop: "50px"
                        }}
                        onFinish={onFinish_StoreOwner}
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
                            <Button type="primary" name="SiteManager" htmlType="submit">
                                Log in as Site Owner
                            </Button>
                        </Form.Item>
                    </Form>

                    <Form
                        name="basic2"

                        onFinish={onFinish_CreateStore}
                        autoComplete="off"
                    >
                        {<Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" style={{ background: "green", borderColor: "yellow" }} htmlType="submit" >
                                Click to Create Store
                            </Button>
                        </Form.Item>}

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
