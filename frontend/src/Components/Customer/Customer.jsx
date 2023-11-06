import React from 'react'
import { Button, Row, Col, Form, Input, InputNumber, Table, Select } from 'antd';
import { useNavigate } from "react-router-dom";


const Customer = () => {

    const navigate = useNavigate();

    const onFinish_filterComputer = (values) => {
        console.log("filter the features:", values);
        // todo: add logic to add computer to the databas
    }
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const PriceOption = ['$2,001 or more', '$1,501 - $2,000', '$1,001 - $1,500', '$501 - $1000', '$500 or less']
    const MemoryOption = ["32 GB or more", "16 GB", "8 GB", "4 GB or less"]
    const StorageSizeOption = ["2 TB or more", "1 TB", "512 GB", "256 GB or less"]
    const ProcessorsOption = ["All Intel Processors", "All AMD Processors"]
    const ProcessGenerationsOption = ["13th Gen Intel", "12th Gen Intel", "11th Gen Intel", "AMD Ryzen 7000 Series", "AMD Ryzen 6000 Series"]
    const GraphicsOption = ["All NVIDIA Graphics", "All AMD Graphics", "All Intel Graphics"]
    const dataSource = [
        {
            key: '1',
            name: 'Computer 1',
            conf: '32GB, 1TB, 12th Gen Intel i9, NVIDIA GeForce RTX 4090',
            p: 20

        },
        {
            key: '2',
            name: 'Computer 2',
            conf: '8GB, 1TB, 11th Gen Intel i9, NVIDIA GeForce RTX 4080',
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
            title: 'Configuration',
            dataIndex: 'conf',
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
            render: () => <Button type="primary">Buy Computer</Button>,
        },

    ];


    const onSignOut = () => {
        navigate('/login')
    }

    return (
        <div className='customer' style={{ margin: '30px' }}>
            <Row>
                <Col className="gutter-row" lg={{ span: 7, offset: 0 }}>

                    <Form
                        name="basic"
                        labelCol={{ span: 8, }}
                        wrapperCol={{ span: 16, }}
                        style={{
                            maxWidth: 600, marginTop: "50px"
                        }}
                        onFinish={onFinish_filterComputer}
                        autoComplete="off"
                    >

                        <h2 style={{ textAlign: 'center' }}>Find Computers</h2>

                        <Form.Item
                            name="price"
                            label="Price"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                options={PriceOption.map((size) => ({ label: size, value: size }))}
                            >
                            </Select>
                        </Form.Item>

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








                        <Form.Item >
                            <Button type="primary" htmlType="submit">
                                Find Computers
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

                </Col>
            </Row>
        </div>


        // {/* This is the page for customer */ }

    )
}

export default Customer
