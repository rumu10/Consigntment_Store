import React from 'react'
import { Button, Row, Col, Form, Input, InputNumber, Table, Select, Checkbox, Divider, Flex, Space } from 'antd';
import { useNavigate } from "react-router-dom";


const Customer = () => {

    const navigate = useNavigate();

    const onFinish_filterComputer = (values) => {
        console.log("filter the features:", values);
        // todo: add logic to add computer to the databas
    }
    const onFinish = (values) => {
        console.log('Success:', values.selectedStores);
        // todo: add logic to generate inventory for these selected stores
    };


    const [computerSelected] = Form.useForm();
    //computerSelected.setFieldsValue({item: dataSource})

    const tableRowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            computerSelected.setFieldsValue({ selectedComputerKey: selectedRowKeys })
            //            console.log(
            //                `selectedRowKeys: ${selectedRowKeys}`,
            //                "selectedRows: ",
            //                selectedRows
            //           )
        },
        getCheckboxProps: record => console.log(record)
    };

    const onFinishComputerSelection = (action) => {
        const values = computerSelected.getFieldsValue();

        console.log('Computer Selected:', values, action);

        if (action == 'buy') {
            console.log('Buy computer: ', values)
        }
        else {
            console.log('Compare computer: ', values)
        }
    }

    const onSignOut = () => {
        navigate('/login')
    }

    // filter options
    const PriceOption = ['$2,001 or more', '$1,501 - $2,000', '$1,001 - $1,500', '$501 - $1000', '$500 or less']
    const MemoryOption = ["32 GB or more", "16 GB", "8 GB", "4 GB or less"]
    const StorageSizeOption = ["2 TB or more", "1 TB", "512 GB", "256 GB or less"]
    const ProcessorsOption = ["All Intel Processors", "All AMD Processors"]
    const ProcessGenerationsOption = ["13th Gen Intel", "12th Gen Intel", "11th Gen Intel", "AMD Ryzen 7000 Series", "AMD Ryzen 6000 Series"]
    const GraphicsOption = ["All NVIDIA Graphics", "All AMD Graphics", "All Intel Graphics"]


    // computer list
    // todo: currently these are mocked computer list data, we need to query these data from the database
    const dataSource = [
        {
            key: '1',
            computerName: 'Computer 1',
            storeName: 'Store 3',
            conf: '32GB, 1TB, 12th Gen Intel i9, NVIDIA GeForce RTX 4090',
            p: 499.99

        },
        {
            key: '2',
            computerName: 'Computer 2',
            storeName: 'Store 4',
            conf: '8GB, 1TB, 11th Gen Intel i9, NVIDIA GeForce RTX 4080',
            p: 329.99

        },
    ];

    const columns = [
        {
            title: 'Computer',
            dataIndex: 'computerName',
            key: 'name',
            width: '25%'
        },
        {
            title: 'Store',
            dataIndex: 'storeName',
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


    ];

    const storeColumns = [
        {
            title: "Name",
            dataIndex: "name",
            render: (text) => <a href="#">{text}</a>
        },

    ];

    // store list
    // todo: currently these are mocked store list data, we need to query these data from the database
    const storeData = [
        {
            key: "1",
            name: "Store 1",
        },
        {
            key: "2",
            name: "Store 2",
        },
        {
            key: "3",
            name: "Store 3",
        },
        {
            key: "4",
            name: "Store 4",
        },
        {
            key: "5",
            name: "Store 5",
        },
        {
            key: "6",
            name: "Store 6",
        },
    ]




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

                        <h2 style={{ textAlign: 'center' }}>Computer Filters</h2>

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
                            <Button type="primary" htmlType="submit" >
                                Find Computers
                            </Button>
                        </Form.Item>

                    </Form>

                </Col>
                <Col className="gutter-row" lg={{ span: 8, offset: 1 }}>
                    <h2 style={{ textAlign: 'center' }}>Computer List</h2>




                    <Form form={computerSelected}>
                        <Form.Item name="selectedComputerKey">
                            <Table rowSelection={tableRowSelection} rowKey={(dataSource) => dataSource.key} dataSource={dataSource} columns={columns} />
                        </Form.Item>

                        <Flex gap="small" wrap="wrap" style={{ marginLeft: '150px' }}>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" name="SiteManager" htmlType="submit" onClick={e => onFinishComputerSelection('buy')}>
                                    Buy Selected
                                </Button>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{
                                    offset: 8,
                                    span: 16,
                                }}
                            >
                                <Button type="primary" name="Store" htmlType="submit" onClick={e => onFinishComputerSelection('compare')}>
                                    Compare Selected
                                </Button>
                            </Form.Item>
                        </Flex>
                    </Form>
                    <br></br>

                </Col>


                <Col className="gutter-row" lg={{ span: 5, offset: 1 }}>
                    <Button type="primary" block onClick={onSignOut}>
                        SignOut
                    </Button>
                    <Divider />




                    <Form
                        name="storeList"
                        onFinish={onFinish}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        layout={'vertical'}
                        style={{ maxWidth: 600 }}
                    >

                        <h2 style={{ textAlign: 'center' }}>Store List by distance</h2>
                        <Form.Item name="selectedStores" wrapperCol={{ span: 8 }}>
                            <Checkbox.Group options={storeData.map((p) => ({ label: p.name, value: p.key }))}>
                            </Checkbox.Group>
                        </Form.Item>
                        <Form.Item label=" " colon={false}>
                            <Button type="primary" htmlType="submit">
                                Generate Inventory
                            </Button>
                        </Form.Item>



                    </Form>


                </Col>
            </Row>
        </div>


        // {/* This is the page for customer */ }

    )
}

export default Customer