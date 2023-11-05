import React from 'react'
import { Button, Row, Col, Form, Input, InputNumber, Table, Select } from 'antd';
import { useNavigate } from "react-router-dom";

const StoreOwner = () => {

    const navigate = useNavigate();

    const onFinish_addComputer = (values) => {
        console.log("computer to add:", values);
        // todo: add logic to add computer to the database
    }

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const MemoryOption = ["32 GB", "16 GB", "12 GB", "8 GB", "4 GB", "1 GB"]
    const StorageSizeOption = ["2 TB", "1 TB", "512 GB", "256 GB", "128 GB"]
    const ProcessorsOption = ["Intel Xeon", "Intel i9", "Intel i7", "AMD Ryzen 9", "AMD Ryzen 7"]
    const ProcessGenerationsOption = ["13th Gen Intel", "12th Gen Intel", "11th Gen Intel", "AMD Ryzen 7000 Series", "AMD Ryzen 6000 Series"]
    const GraphicsOption = ["NVIDIA GeForce RTX 4090", "NVIDIA GeForce RTX 4080", "AMD Radeon Pro W6300", "AMD Radeon Pro W6400", "Integrated Graphics", "Intel UHD Graphics 730", "Intel UHD Graphics 770"]
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

                    <Form
                        name="basic"
                        labelCol={{ span: 8, }}
                        wrapperCol={{ span: 16, }}
                        style={{
                            maxWidth: 600, marginTop: "50px"
                        }}
                        onFinish={onFinish_addComputer}
                        autoComplete="off"
                    >

                        <h2 style={{ textAlign: 'center' }}>Add Computer to store</h2>


                        <Form.Item
                            name="memory"
                            label="Memory"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                options={MemoryOption.map((size) => ({ label: size, value: size }))}
                            >
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="storageSize"
                            label="Storage Size"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                options={StorageSizeOption.map((size) => ({ label: size, value: size }))}
                            >
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="processors"
                            label="Processors"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                options={ProcessorsOption.map((size) => ({ label: size, value: size }))}
                            >
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="processGenerations"
                            label="Process Generations"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                options={ProcessGenerationsOption.map((size) => ({ label: size, value: size }))}
                            >
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="graphics"
                            label="Graphics"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                options={GraphicsOption.map((size) => ({ label: size, value: size }))}
                            >
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="price"
                            label="Price"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item >
                            <Button type="primary" htmlType="submit">
                                Add Computer
                            </Button>
                        </Form.Item>

                    </Form>

                </Col>
                <Col className="gutter-row" lg={{ span: 8, offset: 1 }}>
                    <h2 style={{ textAlign: 'center' }}>Computer List</h2>
                    <Table dataSource={dataSource} columns={columns} />
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
