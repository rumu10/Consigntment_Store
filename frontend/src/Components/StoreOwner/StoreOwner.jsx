import React from 'react'
import { Button, Row, Col, Form, Input, InputNumber, Table } from 'antd';
import { useNavigate } from "react-router-dom";

const StoreOwner = () => {

    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const dataSource = [
        {
            key: '1',
            name: 'Computer 1',
            p: 20

        },
        {
            key: '2',
            name: 'Computer 2',
            p: 30

        },
    ];

    const columns = [
        {
            title: 'Computer',
            dataIndex: 'name',
            key: 'name',
            width: '25%'
        },
        {
            title: 'Price',
            dataIndex: 'p',
            key: 'name',
            width: '25%'
        },
        {
            title: '',
            width: '25%',
            dataIndex: '',
            key: 'x',
            render: () => <Button type="primary" danger >Remove Computer</Button>,
        },

    ];

    const onSignOut = () => {
        navigate('/login')
    }

    return (
        <div className='store-owner' style={{ margin: '30px' }}>
            <Row>
                <Col className="gutter-row" lg={{ span: 7, offset: 0 }}>
                    <h2 style={{ textAlign: 'center' }}>Add Computer to store</h2>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Memory"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Storage Size"
                            name="passwor"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input ',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Processor"
                            name="passwor"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Process Generation"
                            name="passwor"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Graphics"
                            name="passwor"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Price"
                            name="passwor"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input !',
                                },
                            ]}
                        >
                            <InputNumber />
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Add Computer
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col className="gutter-row" lg={{ span: 8, offset: 1 }}>
                    <h2 style={{ textAlign: 'center' }}>Computer List</h2>
                    <Table dataSource={dataSource} columns={columns} />;
                </Col>
                <Col className="gutter-row" lg={{ span: 5, offset: 1 }}>
                    <Button type="primary" block onClick={onSignOut}>
                        SignOut
                    </Button>
                    <h2 style={{ textAlign: 'center', marginTop: '70px', fontSize: '14px' }}>Store Balance:</h2>
                    <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '24px' }}>
                        50
                    </div>
                    <h2 style={{ textAlign: 'center', marginTop: '70px', fontSize: '14px' }}>Store Inventory:</h2>
                    <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '24px' }}>
                        50
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default StoreOwner
