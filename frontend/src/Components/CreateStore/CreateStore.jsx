import React from 'react';
import { Button, Row, Col, Form, Input } from 'antd';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { API_ENDPOINT } from '../../config';

const CreateStore = () => {
    const navigate = useNavigate();

    const onFinish_CreateStore = async (values) => {
        console.log("registering store for: ", values)
        navigate("/store-view")
    }

    return (
        <div className='CreateStorePage'>
            <h2 style={{ textAlign: 'center' }}>Welcome to register your new store</h2>
            <br />
            <br />
            <Row>
                <Form
                    name="basic"

                    style={{
                        maxWidth: 300, marginTop: "50px"
                    }}
                    onFinish={onFinish_CreateStore}
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
                        label="Store Name"
                        name="storeName"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the store name!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>


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


                    {<Form.Item>
                        <Button type="primary" name="StoreOwner" htmlType="submit" >
                            Register Store
                        </Button>
                    </Form.Item>}

                </Form>
            </Row>
        </div>
    )
}

export default CreateStore
